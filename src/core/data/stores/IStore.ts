

export interface IStore<D> {
    addItem(item: D);
    removeItem(item: D);
    getItemById(id: string): D;
    getAllItems(): D[];
    getItemsByType(type: string): D[];
    generateId(item: D): string;
    clear(): void;
    find<T>(prop: (item: D) => T, expectedVal: T): D[];
}