import { createWriteStream } from "fs";
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

export async function download(url: string, destination: string, onProgress?: (progress: number) => any) {
    const resp = await fetch(url);
    const okStart = resp.ok && resp.body;
    if (!okStart) return {
        isOk: false,
        data: resp.statusText,
        err: { res: resp, code: resp.status, statusText: resp.statusText }
    } as const;

    const totalSize = Number(resp.headers.get('Content-Length') || 0);
    let downloadedSize = 0;

    try {
        const reader = resp.body.getReader();
        const writer = createWriteStream(destination);

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            downloadedSize += value.byteLength;
            const progress = Math.floor((downloadedSize / totalSize) * 100);
            log(progress)
            if (onProgress) onProgress(progress);

            writer.write(value);
        }

        writer.end();
        return { isOk: true, data: 'download-success' } as const;
    } catch (error) {
        return {
            isOk: false,
            data: 'Error during download',
            err: error
        } as const;
    }
}

export async function fetchJSON<T>(url: str) {
    try {
        const res = await fetch(url);
        if (!res.ok) return {
            isOk: false,
            err: { res, code: res.status, err: res.statusText }
        } as const

        const json = await res.json() as T;
        return { isOk: true, data: json } as const
    } catch(err) {
        return { isOk: false, err } as const
    }
}