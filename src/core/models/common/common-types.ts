export type Nominal<K, T> = Readonly<T> & {
    __TYPE__: K
}

export type Id<T extends string> = Nominal<T, string>

export type IdCollection<T extends string> = Record<string, Id<T>>

export type Timestamp = number

export type ErrorHandler<T = void> = (error: Error) => T

export type Primitive =
    | bigint
    | boolean
    | null
    | number
    | string
    | symbol
    | undefined

export type PlainObject<T = Primitive> = Record<string, T>

export type JSONValue = Primitive | JSONObject | JSONArray

export interface JSONObject {
    [key: string]: JSONValue
}

export interface JSONArray extends Array<JSONValue> {}
