



export function flat<T>(arr: any[], depth: number): T[] {
    return arr.reduce(function (flatened, toFlatten) {
        return flatened.concat((Array.isArray(toFlatten) && (depth > 1)) ? flat(toFlatten, depth - 1) : toFlatten);
      }, []);
}