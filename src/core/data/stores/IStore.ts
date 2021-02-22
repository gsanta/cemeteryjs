

export interface IStore<D> {
    add(item: D);
    remove(item: D);
    
    getById(id: string): D;
    getAll(): D[];
    getByType(type: string): D[];
    getByTag(tag: string): D[];
    
    clearTag(tag: string): void;
    clear(): void;
    
    generateId(item: D): string;
    find<T>(prop: (item: D) => T, expectedVal: T): D[];
}