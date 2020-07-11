export function sortByKeys<T extends {}, V>(items: T[], ids: readonly V[], key: keyof T): T[] {
    return items.sort((a, b) => ids.indexOf(a[key] as any) - ids.indexOf(b[key] as any));
}

interface GroupReturn<T> {
    [key: string]: T[];
}
export function groupByKeys<T extends {}, V extends string | number>(
    items: T[],
    ids: readonly V[],
    key: keyof T,
): GroupReturn<T> {
    const resultMap: GroupReturn<T> = {};
    ids.forEach(id => (resultMap[id] = []));
    items.forEach(item => {
        if (!item[key]) {
            new TypeError(`[groupByKeys]: ${key} not exist`);
        }
        resultMap[item[key] as any].push(item);
    });

    return resultMap;
}
