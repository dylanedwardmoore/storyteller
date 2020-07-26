import { Text } from './expression'
import { ConvoLogic } from './convo-logic'

type UserChoice = Readonly<{
    text: Text
    logic: ConvoLogic
}>

export default UserChoice
