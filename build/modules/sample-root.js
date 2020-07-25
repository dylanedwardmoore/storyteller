"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sampleModuleData = exports.root = exports.moduleConfig = void 0;
var make_1 = __importDefault(require("../core/util/make"));
exports.moduleConfig = {
    initialState: { variables: {}, currentConvoSegmentPath: make_1.default.absoluteConvoSegmentPath(['root', 'start']) }
};
var restartChoice = {
    text: '/goToStart',
    logic: [{
            conditional: false,
            do: [{
                    type: 'goto',
                    path: ['root', 'start']
                }]
        }]
};
var nestedModule = make_1.default.module({
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
                }
            ]
        }, {
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
});
exports.root = make_1.default.module({
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
                }
            ]
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
});
exports.sampleModuleData = {
    module: exports.root,
    moduleConfig: exports.moduleConfig
};
//# sourceMappingURL=sample-root.js.map