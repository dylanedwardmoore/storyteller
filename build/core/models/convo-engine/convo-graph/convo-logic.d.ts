import { Condition } from './expression';
import ConvoAction from './convo-action';
import DataAction from '../../state/data-action';
export declare type ConvoLogicAction = ConvoAction | DataAction;
export declare type ConditionalConvoLogic = Readonly<{
    if: Condition;
    do: ConvoLogicAction[];
    otherwise: ConvoLogicAction[];
    _compiledAsDo: boolean;
}>;
export declare type ConvoLogic = ConditionalConvoLogic[];
