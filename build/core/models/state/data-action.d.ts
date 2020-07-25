import { JSONValue } from "../common/common-types";
export declare type UpdateValue = {
    type: 'update-value-data-action';
    key: string;
    value: JSONValue;
};
declare type DataAction = Readonly<UpdateValue>;
export default DataAction;
