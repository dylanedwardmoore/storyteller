import { Condition } from "./expression";
import ConvoAction from "./convo-action";
export declare type ConvoLogicAction = ConvoAction;
export declare type ConditionalConvoLogic = Readonly<{
    if: Condition;
    do: ConvoLogicAction[];
    otherwise: ConvoLogicAction[];
}>;
export declare type ConvoLogic = ConditionalConvoLogic[];
