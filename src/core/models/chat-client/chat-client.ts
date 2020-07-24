import { ConvoManagerConstructor } from "../convo-engine/managers/convo-manager"
import ConvoModule from "../convo-engine/convo-graph/convo-module"
import { InitialUserState } from "../state/state"


type APIKey = string

export type ChatCommand = string

export type ModuleConfig = {
    name: string
    welcomeMessage?: string
    farwellMessage?: string
    startModuleCommand: ChatCommand,
    endModuleCommand: ChatCommand,
    initialState: InitialUserState
}

export type ModuleData = {
    module: ConvoModule
    moduleConfig: ModuleConfig
}

export interface ChatClient {
    runModules: (modulesData: ModuleData[], convoManagerConstructor: ConvoManagerConstructor) => void
}

export type ChatClientConstructor = (key: APIKey) => ChatClient

export default ChatClient
