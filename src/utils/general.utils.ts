import { readFile, writeFile } from "fs/promises";

export const wait = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function readJSON<T>(path: string)  {
    try {
        return JSON.parse(await readFile(path, { encoding: 'utf-8' })) as T
    } finally {
        return null;
    }
}

export async function writeJSON(path: string, data: any) {
    try {
        const jsonStr =  JSON.stringify(data)
        await writeFile(path, jsonStr, { encoding: 'utf-8' });
        return true;
    } catch(err) {
        logErr(`Problem writing JSON to path: ${path}`);
        logErr(err);
        return false;
    }
}

/**
 * The function will test if the type of the first
 * argument equals testType. Argument testType is a string
 * representing a javascript type.
 *
 * @param val value to be tested
 * @param testType to check if typeof val === testType
 * @example
 * ```js
 * isType([], 'array') //=> true
 * isType(null, 'undefined') //=> false
 * ```
 */
export const isType = <T extends JsType> (
    val: any, testType: T
): val is JsTypeFind<T> => type(val) === testType;

/** An improvement on `typeof` */
export function type(val: any): JsType {
    if (val === null)               return 'null';
    if (Array.isArray(val))         return 'array';
    if (typeof val === 'object')    return 'object';
    if (val !== val)                return 'NaN';

    return typeof val;
}