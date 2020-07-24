import { module, convoSegmentPath } from "../core/util/make/graph-components";
import { ModuleData, ModuleConfig } from "../core/models/chat-client/chat-client";

export const moduleConfig: ModuleConfig = {
    name: 'sample',
    startModuleCommand: '/startSample',
    endModuleCommand: 'endSample',
    initialState: { variables: {}, currentConvoSegmentPath: convoSegmentPath(['start']) }
}

export const root = module({
    id: 'root',
    submodules: [],
    convoSegments: [{
        id: 'start',
        convo: [{
            type: 'text',
            text: 'this chatbot says welcome'
        }],
        choices: [{
            text: '/goToStart',
            logic: [{
                conditional: false,
                do: [{
                    type: 'goto',
                    path: ['start']
                }]
            }]
        },
        {
            text: '/sample2',
            logic: [{
                conditional: false,
                do: [{
                    type: 'goto',
                    path: ['root', 'sample2']
                }]
            }]
        }]
    },
    {
        id: 'sample2',
        convo: [{
            type: 'text',
            text: 'oh this absolute path works too'
        }],
        choices: [{
            text: '/goBackToStart',
            logic: [{
                conditional: false,
                do: [{
                    type: 'goto',
                    path: ['start']
                }]
            }]
        }]
    }]
})

export const sampleModuleData: ModuleData = {
    module: root,
    moduleConfig
}