import { _Choice, _Logic, _Text, _ImageNode, _ConvoSegmentPath, _Condition } from "./unvalidated-types";
declare type Identity<T> = (value: T) => T;
export declare const choice: Identity<_Choice>;
export declare const logic: Identity<_Logic>;
export declare const text: Identity<_Text>;
export declare const image: Identity<_ImageNode>;
export declare const convoSegmentPath: Identity<_ConvoSegmentPath>;
export declare const condition: Identity<_Condition>;
export {};