"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sampleModuleData = exports.moduleConfig = void 0;
var graph_components_1 = require("../core/util/make/graph-components");
var sample_root_1 = require("./sample-root");
exports.moduleConfig = {
    initialState: { variables: {}, currentConvoSegmentPath: graph_components_1.absoluteConvoSegmentPath(['root', 'start']) }
};
exports.sampleModuleData = {
    module: sample_root_1.root,
    moduleConfig: exports.moduleConfig
};
//# sourceMappingURL=config.js.map