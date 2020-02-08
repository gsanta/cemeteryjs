



export function flat<T>(arr: any[], depth: number): T[] {
    return arr.reduce(function (flatened, toFlatten) {
        return flatened.concat((Array.isArray(toFlatten) && (depth > 1)) ? flat(toFlatten, depth - 1) : toFlatten);
      }, []);
}

export function without<T>(arr: T[], ...exclude: T[]): T[] {
    return arr.filter(element => !exclude.includes(element));
}

export function last<T>(arr: T[]): T {
    return arr[arr.length - 1];
}


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

export function range(from: number, to: number): number [] {
	const nums: number[] = [];

	for (let i = from; i < to; i++) {
		nums.push(i);
	}

	return nums;
}

export function sortNum(arr: number[]): number[] {
	return [...arr].sort((a, b) => a - b);
}


export function debounce<T extends Function>(func: T, wait: number): T {
	let timeout;
	return <any> function() {
		const context = this, args = arguments;
		const later = function() {
			timeout = null;
			func.apply(context, args);
        };

		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	};
};

export function arraysEqual<T extends {equalTo(other: T)}>(arr1: T[], arr2: T[]): boolean {
	const notFound = arr1.find(arr1Item => !arr2.find(arr2Item => arr1Item.equalTo(arr2Item)));

	return !notFound;
}