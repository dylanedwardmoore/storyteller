import { Either } from 'fp-ts/lib/Either'
import { Nominal } from '../../common/common-types'
import {
    StateDependentResult,
    GeneralizedState,
    GeneralizedStateUpdate,
} from '../../state/state'

export type TextExpressionNominalType = 'text-expression'

export type ConditionExpressionNominalType = 'condition-expression'

export type NumberExpressionNominalType = 'number-expression'

export type FilepathExpressionNominalType = 'filepath-expression'

export type StateUpdateExpressionNominalType = 'state-update-expression'

export type Expression<K, T> = {
    __type__: K
    stateDependentResult: StateDependentResult<T>
}

export type StateUpdate = Expression<
    StateUpdateExpressionNominalType,
    GeneralizedStateUpdate
>

export type Text = Expression<TextExpressionNominalType, string>

export type Condition = Expression<ConditionExpressionNominalType, boolean>

export type Number = Expression<NumberExpressionNominalType, number>

export type Filepath = Expression<FilepathExpressionNominalType, string>
