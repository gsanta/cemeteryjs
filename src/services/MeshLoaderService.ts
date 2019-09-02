import { MeshTemplate } from "../MeshTemplate";
import { MeshDescriptor, FileDescriptor } from "../Config";

export interface MeshLoaderService<M, S> {
    meshTemplates: Map<string, MeshTemplate<M, S>>;
    loadAll(meshDescriptors: MeshDescriptor<FileDescriptor>[]): Promise<unknown>;
}