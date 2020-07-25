import { Text } from "./expression";
import { ConvoLogic } from "./convo-logic";
declare type UserChoice = Readonly<{
    text: Text;
    logic: ConvoLogic;
}>;
export default UserChoice;
