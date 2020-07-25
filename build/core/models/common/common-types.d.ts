export declare type Nominal<K, T> = Readonly<T> & {
    __TYPE__: K;
};
export declare type Id<T extends string> = Nominal<T, string>;
export declare type IdCollection<T extends string> = Record<string, Id<T>>;
export declare type Timestamp = number;
export declare type ErrorHandler<T = void> = (error: Error) => T;
export declare type Primitive = bigint | boolean | null | number | string | symbol | undefined;
export declare type PlainObject<T = Primitive> = Record<string, T>;
export declare type JSONValue = Primitive | JSONObject | JSONArray;
export interface JSONObject {
    [key: string]: JSONValue;
}
export interface JSONArray extends Array<JSONValue> {
}
