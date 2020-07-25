"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.root = void 0;
var make_1 = __importDefault(require("../core/util/make"));
var child_module_1 = require("./child-module");
exports.root = make_1.default.module({
    id: 'root',
    submodules: [child_module_1.nestedModule],
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
//# sourceMappingURL=sample-root.js.map