export declare const root: Readonly<{
    id: import("../core/models/common/common-types").Nominal<"convo-module-id", string>;
    submodules: Record<string, Readonly<any>>;
    convoSegments: Record<string, Readonly<{
        id: import("../core/models/common/common-types").Nominal<"convo-segment-id", string>;
        convoNodes: import("../core/models/convo-engine/convo-graph/convo-node").default[];
        choices: Readonly<{
            text: import("../core/models/convo-engine/convo-graph/expression").Expression<"text-expression", string>;
            logic: import("../core/models/convo-engine/convo-graph/convo-logic").ConvoLogic;
        }>[];
        preLogic: import("../core/models/convo-engine/convo-graph/convo-logic").ConvoLogic;
        postLogic: import("../core/models/convo-engine/convo-graph/convo-logic").ConvoLogic;
    }>>;
}>;
