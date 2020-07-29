import make from '../core/util/make'

const restartChoice = make.choice({
    text: '/goToStart',
    logic: [
        {
            do: [
                {
                    type: 'goto',
                    path: ['root', '/start'],
                },
            ],
        },
    ],
})

export const nestedModule = make.module({
    id: 'child',
    submodules: [],
    convoSegments: [
        {
            id: 'childSegment',
            convo: [
                {
                    type: 'text',
                    text: 'this is a child convo segment',
                },
                {
                    type: 'text',
                    text: 'it has two parts',
                },
            ],
            choices: [
                {
                    text: '/relativeChild',
                    logic: [
                        {
                            do: [
                                {
                                    type: 'goto',
                                    path: ['otherChildSegement'],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            id: 'otherChildSegement',
            convo: [
                {
                    type: 'text',
                    text: 'this is the other child node',
                },
            ],
            choices: [restartChoice],
        },
    ],
})
