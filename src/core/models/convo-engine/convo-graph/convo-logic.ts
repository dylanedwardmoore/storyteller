import { Condition } from "./expression";
import ConvoAction from "./convo-action";
import DataAction from "../../state/data-action";


export type ConvoLogicAction =  ConvoAction // | DataAction

export type ConditionalConvoLogic = Readonly<{
    if: Condition
    do: ConvoLogicAction[]
    otherwise: ConvoLogicAction[]
}>

export type ConvoLogic = ConditionalConvoLogic[]