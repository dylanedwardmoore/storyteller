import { StateDependentResult, GeneralizedStateUpdate } from '../../state/state';
export declare type TextExpressionNominalType = 'text-expression';
export declare type ConditionExpressionNominalType = 'condition-expression';
export declare type NumberExpressionNominalType = 'number-expression';
export declare type FilepathExpressionNominalType = 'filepath-expression';
export declare type StateUpdateExpressionNominalType = 'state-update-expression';
export declare type Expression<K, T> = {
    __type__: K;
    stateDependentResult: StateDependentResult<T>;
};
export declare type StateUpdate = Expression<StateUpdateExpressionNominalType, GeneralizedStateUpdate>;
export declare type Text = Expression<TextExpressionNominalType, string>;
export declare type Condition = Expression<ConditionExpressionNominalType, boolean>;
export declare type Number = Expression<NumberExpressionNominalType, number>;
export declare type Filepath = Expression<FilepathExpressionNominalType, string>;
