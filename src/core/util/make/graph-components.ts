import ConvoModule, { ConvoModuleId } from "../../models/convo-engine/convo-graph/convo-module";
import ConvoAction from "../../models/convo-engine/convo-graph/convo-action";
import { _ConvoModule, _ConvoSegment, _ConvoSegmentId, _ModuleId, _Choice, _ConvoNode, _ImageNode, _TextNode, _Text, _Filepath, _Logic, _Condition, _ConvoAction, _ConvoSegmentPath } from "./unvalidated-types";
import ConvoSegment, { ConvoSegmentId } from "../../models/convo-engine/convo-graph/convo-segment";
import UserChoice from "../../models/convo-engine/convo-graph/user-choice";
import ConvoNode from "../../models/convo-engine/convo-graph/convo-node";
import ImageNode from "../../models/convo-engine/convo-graph/image-node";
import TextNode, { TextNodeNominalType } from "../../models/convo-engine/convo-graph/text-node";
import { Text, Filepath, Condition } from "../../models/convo-engine/convo-graph/expression";
import { right } from "fp-ts/lib/Either";
import { ConditionalConvoLogic, ConvoLogic, ConvoLogicAction } from "../../models/convo-engine/convo-graph/convo-logic";
import { ConvoSegmentPath, AbsoluteConvoSegmentPath } from "../../models/convo-engine/convo-graph/convo-path";


function convoModuleId(unvalidatedId: _ModuleId): ConvoModuleId {
    return unvalidatedId as ConvoModuleId
}

function convoSegmentId(unvalidatedId: _ConvoSegmentId): ConvoSegmentId {
    return unvalidatedId as ConvoSegmentId
}

export function absoluteConvoSegmentPath(content: _ConvoSegmentPath): AbsoluteConvoSegmentPath {
    if (content.length == 0) {
        throw new Error(`Empty convo segment path is not allowed`)
    }
    if (content.length == 1) {
        throw new Error(`To make an absolute path, you must specify the parent modules`)
    }
    return convoSegmentPath(content) as AbsoluteConvoSegmentPath
}

function convoSegmentPath(content: _ConvoSegmentPath): ConvoSegmentPath {
    if (content.length === 0) {
        throw new Error(`Empty convo segment path is not allowed`)
    }
    const parentModules: ConvoModuleId[] = content.slice(0, content.length - 1).map(unverified => convoModuleId(unverified))
    const id: ConvoSegmentId = convoSegmentId(content[content.length - 1])
    const relativePath = parentModules.length > 0
    return relativePath ? {
        id,
        parentModules
    } : {
        id
    }
}

function convoLogicAction(content: _ConvoAction): ConvoLogicAction {
    return {
        type: 'start-convo-segment',
        path: convoSegmentPath(content.path)
    }
}

function convoLogicActions(content: _ConvoAction[]): ConvoLogicAction[] {
    return content.map(unvalidated => convoLogicAction(unvalidated))
}

function text(content: _Text) : Text {
    return right(content) as Text
}

function conditional(content: _Condition): Condition {
    return right(content) as Condition
}

function convoLogic(content: _Logic[]): ConvoLogic {
    return content.map(unvalidated => {
        if (unvalidated.if !== undefined) {
        return {
                if: conditional(unvalidated.if),
                do: convoLogicActions(unvalidated.do),
                otherwise: unvalidated.otherwise ? convoLogicActions(unvalidated.otherwise) : []
            }
        } else {
            return {
                if: conditional(true),
                do: convoLogicActions(unvalidated.do),
                otherwise: convoLogicActions(unvalidated.do)
            }
        }
    })   
}

function choice(content: _Choice): UserChoice {
    return {
        text: text(content.text),
        logic: convoLogic(content.logic)
    }
}

function filepath(content: _Filepath): Filepath {
    return right(content) as Filepath
}

function imageNode(content: _ImageNode): ImageNode {
    return {
        __TYPE__: 'image-node',
        src: filepath(content.src)
    }
}

function textNode(content: _TextNode): TextNode {
    return {
        __TYPE__: 'text-node',
        text: text(content.text)
    }
}

function convoNode(content: _ConvoNode): ConvoNode {
    switch(content.type) {
        case 'image' :
            return imageNode(content)
        case 'text':
            return textNode(content)
        default:
            throw new Error(`Unreachable code in switch case for generating convo node`)
    }
}

function convoSegment(content: _ConvoSegment): ConvoSegment {
    return {
        id: convoSegmentId(content.id),
        choices: content.choices.map(unvalidated => choice(unvalidated)),
        convoNodes: content.convo.map(unvalidated => convoNode(unvalidated)),
        preLogic: [],
        postLogic: []
    }
}

export function module(content: _ConvoModule): ConvoModule {
    const reducer: <T extends ConvoModule | ConvoSegment>(type: string) => (acc: Record<string, T>, curr: T) => Record<string, T> = type => (acc, curr) => {
        if(acc[curr.id] !== undefined) {
            throw new Error(`Cannot construct module with id ${content.id}, the ${type} with id ${curr.id} has a duplicate id in this module's definition.`)
        }
        return {
            ...acc,
            [curr.id]: curr
        }
    }

    const submodules = content.submodules !== undefined
        ? content.submodules.reduce(reducer<ConvoModule>('submodule'), {}) 
        : {}

    const convoSegments = content.convoSegments !== undefined
        ? content.convoSegments.map(unvalidated => convoSegment(unvalidated))
            .reduce(reducer<ConvoSegment>('convo segment'), {}) 
        : {}
    return {
        id: convoModuleId(content.id),
        submodules,
        convoSegments
    }
}
