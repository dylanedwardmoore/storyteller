import ConvoModule, {
    ConvoModuleId,
} from '../../models/convo-engine/convo-graph/convo-module'
import {
    _ConvoModule,
    _ConvoSegment,
    _ConvoSegmentId,
    _ModuleId,
    _Choice,
    _ConvoNode,
    _ImageNode,
    _TextNode,
    _Text,
    _Filepath,
    _Logic,
    _Condition,
    _StartConvoAction,
    _ConvoSegmentPath,
    ResultOrStateDependentResult,
    _Action,
    _UpdateStateAction,
    _StateUpdate,
} from './unvalidated-types'
import ConvoSegment, {
    ConvoSegmentId,
} from '../../models/convo-engine/convo-graph/convo-segment'
import UserChoice from '../../models/convo-engine/convo-graph/user-choice'
import ConvoNode from '../../models/convo-engine/convo-graph/convo-node'
import ImageNode from '../../models/convo-engine/convo-graph/image-node'
import TextNode from '../../models/convo-engine/convo-graph/text-node'
import {
    Text,
    Filepath,
    Condition,
    StateUpdate,
} from '../../models/convo-engine/convo-graph/expression'
import {
    ConvoLogic,
    ConvoLogicAction,
} from '../../models/convo-engine/convo-graph/convo-logic'
import {
    ConvoSegmentPath,
    AbsoluteConvoSegmentPath,
} from '../../models/convo-engine/convo-graph/convo-path'
import {
    StateDependentResult,
    GeneralizedState,
} from '../../models/state/state'
import { JSONValue } from '../../models/common/common-types'

function convoModuleId(unvalidatedId: _ModuleId): ConvoModuleId {
    return unvalidatedId as ConvoModuleId
}

function convoSegmentId(unvalidatedId: _ConvoSegmentId): ConvoSegmentId {
    return unvalidatedId as ConvoSegmentId
}

export function absoluteConvoSegmentPath(
    content: _ConvoSegmentPath
): AbsoluteConvoSegmentPath {
    if (content.length == 0) {
        throw new Error(`Empty convo segment path is not allowed`)
    }
    if (content.length == 1) {
        throw new Error(
            `To make an absolute path, you must specify the parent modules`
        )
    }
    return convoSegmentPath(content) as AbsoluteConvoSegmentPath
}

function convoSegmentPath(content: _ConvoSegmentPath): ConvoSegmentPath {
    if (content.length === 0) {
        throw new Error(`Empty convo segment path is not allowed`)
    }
    const parentModules: ConvoModuleId[] = content
        .slice(0, content.length - 1)
        .map(unverified => convoModuleId(unverified))
    const id: ConvoSegmentId = convoSegmentId(content[content.length - 1])
    const relativePath = parentModules.length > 0
    return relativePath
        ? {
              id,
              parentModules,
          }
        : {
              id,
          }
}

function startConvoAction(content: _StartConvoAction): ConvoLogicAction {
    return {
        type: 'start-convo-segment',
        path: convoSegmentPath(content.path),
    }
}

function updateStateAction(content: _UpdateStateAction): ConvoLogicAction {
    return {
        type: 'update-state-data-action',
        updates: stateUpdate(content.update),
    }
}

function logicActions(content: _Action[]): ConvoLogicAction[] {
    return content.map(unvalidated => {
        switch (unvalidated.type) {
            case 'goto':
                return startConvoAction(unvalidated)
            case 'update-state':
                return updateStateAction(unvalidated)
            default:
                throw new Error(
                    'Unreachable code: this switch-case statement should be exaustive'
                )
        }
    })
}

function wrapAsStateDependentExpression<T extends JSONValue>(
    resultOrStateDependentResult: ResultOrStateDependentResult<T>
): { stateDependentResult: StateDependentResult<T> } {
    const wrap = (inner: StateDependentResult<T>) => ({
        stateDependentResult: inner,
    })
    if (typeof resultOrStateDependentResult === 'function') {
        return wrap(resultOrStateDependentResult as StateDependentResult<T>)
    } else {
        return wrap(
            (state => resultOrStateDependentResult) as StateDependentResult<T>
        )
    }
}

function text(content: _Text): Text {
    return wrapAsStateDependentExpression(content) as Text
}

function stateUpdate(content: _StateUpdate): StateUpdate {
    return wrapAsStateDependentExpression(content) as StateUpdate
}

function conditional(content: _Condition): Condition {
    return wrapAsStateDependentExpression(content) as Condition
}

function convoLogic(content: _Logic[]): ConvoLogic {
    return content.map(unvalidated => {
        if (unvalidated.if !== undefined) {
            return {
                if: conditional(unvalidated.if),
                do: logicActions(unvalidated.do),
                otherwise: unvalidated.otherwise
                    ? logicActions(unvalidated.otherwise)
                    : [],
                _compiledWithoutConditional: false,
            }
        } else {
            return {
                if: conditional(true),
                do: logicActions(unvalidated.do),
                otherwise: logicActions(unvalidated.do),
                _compiledWithoutConditional: true,
            }
        }
    })
}

function choice(content: _Choice): UserChoice {
    return {
        text: text(content.text),
        logic: convoLogic(content.logic),
    }
}

function filepath(content: _Filepath): Filepath {
    return wrapAsStateDependentExpression(content) as Filepath
}

function imageNode(content: _ImageNode): ImageNode {
    return {
        __TYPE__: 'image-node',
        src: filepath(content.src),
    }
}

function textNode(content: _TextNode): TextNode {
    return {
        __TYPE__: 'text-node',
        text: text(content.text),
    }
}

function convoNode(content: _ConvoNode): ConvoNode {
    switch (content.type) {
        case 'image':
            return imageNode(content)
        case 'text':
            return textNode(content)
        default:
            throw new Error(
                `Unreachable code in switch case for generating convo node`
            )
    }
}

function convoSegment(content: _ConvoSegment): ConvoSegment {
    return {
        id: convoSegmentId(content.id),
        choices: content.choices.map(unvalidated => choice(unvalidated)),
        convoNodes: content.convo.map(unvalidated => convoNode(unvalidated)),
        preLogic: [],
        postLogic: [],
        defaultChoice:
            content.default === undefined
                ? undefined
                : convoLogic(content.default),
    }
}

export function module(content: _ConvoModule): ConvoModule {
    const reducer: <T extends ConvoModule | ConvoSegment>(
        type: string
    ) => (acc: Record<string, T>, curr: T) => Record<string, T> = type => (
        acc,
        curr
    ) => {
        if (acc[curr.id] !== undefined) {
            throw new Error(
                `Cannot construct module with id ${content.id}, the ${type} with id ${curr.id} has a duplicate id in this module's definition.`
            )
        }
        return {
            ...acc,
            [curr.id]: curr,
        }
    }

    const submodules =
        content.submodules !== undefined
            ? content.submodules.reduce(reducer<ConvoModule>('submodule'), {})
            : {}

    const convoSegments =
        content.convoSegments !== undefined
            ? content.convoSegments
                  .map(unvalidated => convoSegment(unvalidated))
                  .reduce(reducer<ConvoSegment>('convo segment'), {})
            : {}
    return {
        id: convoModuleId(content.id),
        submodules,
        convoSegments,
    }
}
