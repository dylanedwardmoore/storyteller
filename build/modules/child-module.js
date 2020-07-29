"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nestedModule = void 0;
var make_1 = __importDefault(require("../core/util/make"));
var restartChoice = make_1.default.choice({
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
});
exports.nestedModule = make_1.default.module({
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
});
//# sourceMappingURL=child-module.js.map