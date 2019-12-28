export function minBy<T>(collection: T[], callback: (a: T, b: T) => number) {
	if (collection.length === 0) {
		return undefined;
	}

	const select = (a, b) => callback(a, b) < 0 ? a : b;
	return collection.reduce(select, collection[0]);
}

export function maxBy<T>(collection: T[], callback: (a: T, b: T) => number): T {
	if (collection.length === 0) {
		return undefined;
	}

	const select = (a, b) => callback(a, b) > 0 ? a : b;
	return collection.reduce(select, collection[0]);
}

export function without<T>(arr: T[], ...exclude: T[]): T[] {
    return arr.filter(element => !exclude.includes(element));
}

export function last<T>(arr: T[]): T {
    return arr[arr.length - 1];
}

export function every<T>(arr: T[], callback: (item: T, index: number) => boolean): boolean {
    return arr.filter((item, index) => callback(item, index)).length === arr.length;
}

export function sort<T>(arr: T[], sortFunction: (a: T, b: T) => number): T[] {
	const copy = [...arr];

	copy.sort(sortFunction);

	return copy;
}