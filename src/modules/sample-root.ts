import make from "../core/util/make";
import { ModuleData, ModuleConfig } from "../core/models/chat-client/chat-client";

export const moduleConfig: ModuleConfig = {
    initialState: { variables: {}, currentConvoSegmentPath: make.absoluteConvoSegmentPath(['root', 'start']) }
}

const restartChoice = {
        text: '/goToStart',
        logic: [{
            conditional: false,
            do: [{
                type: 'goto',
                path: ['root', 'start']
            }]
        }]
    }

const nestedModule = make.module({
    id: 'child',
    submodules: [],
    convoSegments: [{
        id: 'childSegment',
        convo: [{
            type: 'text',
            text: 'this is a child convo segment'
        }, {
            type: 'text',
            text: 'it has two parts'
        }],
        choices: [
        {
            text: '/relativeChild',
            logic: [{
                do: [{
                    type: 'goto',
                    path: ['otherChildSegement']
                }]
            }]
        }]
    },{
        id: 'otherChildSegement',
        convo: [{
            type: 'text',
            text: 'this is the other child node'
        }],
        choices: [{
            text: '/goBackToStart',
            logic: [{
                do: [{
                    type: 'goto',
                    path: ['root', 'start']
                }]
            }]
        }]
    }]
})

export const root = make.module({
    id: 'root',
    submodules: [nestedModule],
    convoSegments: [{
        id: 'start',
        convo: [{
            type: 'text',
            text: 'this chatbot says welcome'
        }],
        choices: [
        {
            text: '/sample2',
            logic: [{
                if: false,
                do: [{
                    type: 'goto',
                    path: ['root', 'sample2']
                }],
                otherwise: [{
                    type: 'goto',
                    path: ['root', 'child', 'childSegment']
                }]
            }]
        }, {
            text: '/child',
            logic: [{
                do: [{
                    type: 'goto',
                    path: ['root', 'child', 'childSegment']
                }]
            }]
        }]
    },
    {
        id: 'sample2',
        convo: [{
            type: 'text',
            text: 'oh this <b>absolute path</b> works too'
        }, 
        {
            type: 'image',
            src: 'https://imaging.nikon.com/lineup/dslr/df/img/sample/img_01.jpg'
        }],
        choices: [{
            text: '/goBackToStart',
            logic: [{
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
