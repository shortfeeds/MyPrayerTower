export type SafeJSON<T> = T extends Date
    ? string
    : T extends BigInt
    ? string
    : T extends Array<infer U>
    ? Array<SafeJSON<U>>
    : T extends object
    ? { [K in keyof T]: SafeJSON<T[K]> }
    : T;

/**
 * Deeply converts an object to a safe JSON structure.
 * - Dates -> ISO Strings
 * - BigInts -> Strings
 * - Removes undefined/nulls if needed (optional)
 */
export function toSafeJSON<T>(data: T): SafeJSON<T> {
    if (data === null || data === undefined) {
        return data as any;
    }

    if (typeof data === 'bigint') {
        return data.toString() as any;
    }

    if (data instanceof Date) {
        return data.toISOString() as any;
    }

    if (Array.isArray(data)) {
        return data.map(item => toSafeJSON(item)) as any;
    }

    if (typeof data === 'object') {
        const result: any = {};
        for (const key of Object.keys(data)) {
            const value = (data as any)[key];
            result[key] = toSafeJSON(value);
        }
        return result;
    }

    return data as any;
}
