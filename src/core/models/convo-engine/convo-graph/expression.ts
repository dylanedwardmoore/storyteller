import { Either } from 'fp-ts/lib/Either'
import { Nominal } from '../../common/common-types'


export type TextExpressionNominalType = 'text-expression'

export type ConditionExpressionNominalType = 'condition-expression'

export type NumberExpressionNominalType = 'number-expression'

export type FilepathExpressionNominalType = 'filepath-expression'

export type Expression<K, T> =  Nominal<K, Either<Error, Readonly<T>>> // TODO: Rework expressions to allow for state reteival

export type Text = Expression<TextExpressionNominalType, string>

export type Condition = Expression<ConditionExpressionNominalType, boolean>

export type Number = Expression<NumberExpressionNominalType, number>

export type Filepath = Expression<FilepathExpressionNominalType, string>
