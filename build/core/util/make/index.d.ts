import { module } from './graph-components';
declare const make: {
    module: typeof module;
    choice: (value: import("./unvalidated-types")._Choice) => import("./unvalidated-types")._Choice;
    logic: (value: import("./unvalidated-types")._Logic) => import("./unvalidated-types")._Logic;
    text: (value: import("./unvalidated-types").ResultOrStateDependentResult<string>) => import("./unvalidated-types").ResultOrStateDependentResult<string>;
    image: (value: import("./unvalidated-types")._ImageNode) => import("./unvalidated-types")._ImageNode;
    convoSegmentPath: (value: import("./unvalidated-types")._ConvoSegmentPath) => import("./unvalidated-types")._ConvoSegmentPath;
    condition: (value: import("./unvalidated-types").ResultOrStateDependentResult<boolean>) => import("./unvalidated-types").ResultOrStateDependentResult<boolean>;
};
export default make;
