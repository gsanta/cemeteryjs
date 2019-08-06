
export interface MeshTemplate<M, S> {
    getMeshes: () => M[];
    getSkeletons: () => S[];
    type: string;
}