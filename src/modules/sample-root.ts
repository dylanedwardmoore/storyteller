import make from '../core/util/make'
import { nestedModule } from './child-module'
import { stateManagerConstructor } from '../core/convo-engine/state-manager'
import log from '../core/util/logging'

export const root = make.module({
    id: 'root',
    submodules: [nestedModule],
    convoSegments: [
        {
            id: '/start',
            convo: [
                {
                    type: 'image',
                    src:
                        'https://imaging.nikon.com/lineup/dslr/df/img/sample/img_01.jpg',
                },
                {
                    type: 'text',
                    text: state => `this chatbot says welcome ${state.userId}`,
                },
                {
                    type: 'text',
                    text: state => '1test value is ' + state.testValue,
                },
                {
                    type: 'text',
                    text: state => '2test value is ' + state.testValue,
                },
                {
                    type: 'text',
                    text: state => '3test value is ' + state.testValue,
                },
                {
                    type: 'text',
                    text: state => '4test value is ' + state.testValue,
                },
                {
                    type: 'text',
                    text: state => '5test value is ' + state.testValue,
                },
                {
                    type: 'text',
                    text: state => '6test value is ' + state.testValue,
                },
                {
                    type: 'text',
                    text: state => '7test value is ' + state.testValue,
                },
                {
                    type: 'image',
                    src:
                        'https://imaging.nikon.com/lineup/dslr/df/img/sample/img_01.jpg',
                },
            ],
            choices: [
                {
                    text: '/start',
                    logic: [
                        {
                            do: [
                                {
                                    type: 'goto',
                                    path: ['root', 'sample2'],
                                },
                            ],
                        },
                    ],
                },
                {
                    text: 'updateCounter',
                    logic: [
                        {
                            if: state => state.testValue < 3,
                            do: [
                                {
                                    type: 'update-state',
                                    update: state => ({
                                        testValue: state.testValue + 1,
                                    }),
                                },
                                {
                                    type: 'goto',
                                    path: ['root', '/start'],
                                },
                            ],
                            otherwise: [
                                {
                                    type: 'update-state',
                                    update: { testValue: 0 },
                                },
                                {
                                    type: 'goto',
                                    path: ['root', '/start'],
                                },
                            ],
                        },
                    ],
                },
                {
                    text: '/child',
                    logic: [
                        {
                            do: [
                                {
                                    type: 'goto',
                                    path: ['root', 'child', 'childSegment'],
                                },
                            ],
                        },
                    ],
                },
            ],
            default: [
                {
                    if: state => state.lastTextMessage.length > 20,
                    do: [
                        {
                            type: 'goto',
                            path: ['longMessage'],
                        },
                    ],
                    otherwise: [
                        {
                            type: 'goto',
                            path: ['/start'],
                        },
                    ],
                },
            ],
        },
        {
            id: 'longMessage',
            convo: [
                {
                    type: 'text',
                    text: state =>
                        `<b>${state.lastTextMessage}</b> is a long message!`,
                },
            ],
            choices: [
                {
                    text: 'yep',
                    logic: [
                        {
                            do: [
                                {
                                    type: 'goto',
                                    path: ['/start'],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            id: 'sample2',
            convo: [
                {
                    type: 'text',
                    text: 'oh this <b>absolute path</b> works too',
                },
                {
                    type: 'image',
                    src:
                        'https://imaging.nikon.com/lineup/dslr/df/img/sample/img_01.jpg',
                },
            ],
            choices: [
                {
                    text: '/goBackToStart',
                    logic: [
                        {
                            do: [
                                {
                                    type: 'goto',
                                    path: ['/start'],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
})
