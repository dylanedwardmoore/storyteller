"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var graph_components_1 = require("../core/util/make/graph-components");
exports.moduleConfig = {
    name: 'sample',
    startModuleCommand: '/startSample',
    endModuleCommand: 'endSample',
    initialState: { variables: {}, currentConvoSegmentPath: graph_components_1.convoSegmentPath(['root', 'start']) }
};
exports.root = graph_components_1.module({
    id: 'root',
    submodules: [],
    convoSegments: [{
            id: 'start',
            convo: [{
                    type: 'text',
                    text: 'this chatbot says welcome'
                }],
            choices: []
        }]
});
exports.sampleModuleData = {
    module: exports.root,
    moduleConfig: exports.moduleConfig
};
//# sourceMappingURL=sample-root.js.map