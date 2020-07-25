import make from "../core/util/make";
import { ModuleData } from "../core/models/chat-client/chat-client";
import { nestedModule } from "./child-module";

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
