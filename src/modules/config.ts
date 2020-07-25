import { ModuleConfig, ModuleData } from "../core/models/chat-client/chat-client";
import { absoluteConvoSegmentPath } from "../core/util/make/graph-components";
import { root } from "./sample-root";

export const moduleConfig: ModuleConfig = {
    initialState: { variables: {}, currentConvoSegmentPath: absoluteConvoSegmentPath(['root', 'start']) }
}

export const sampleModuleData: ModuleData = {
    module: root,
    moduleConfig
}
