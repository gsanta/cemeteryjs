
export interface IMeshStore<T> {
    addModel(name: string, mesh: T);
    addClone(name: string, mesh: T);
    getMesh(name: string): T;
    clear(): void;
}