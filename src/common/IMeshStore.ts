
export interface IMeshStore<T> {
    addMesh(name: string, mesh: T);
    addClone(name: string, mesh: T);
    getMesh(name: string): T;
    clear(): void;
}