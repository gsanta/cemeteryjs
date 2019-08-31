import { MeshTemplate } from "../integrations/api/MeshTemplate";
import { MeshDescriptor, FileDescriptor } from "../integrations/api/Config";

export interface MeshLoaderService<M, S> {
    meshTemplates: Map<string, MeshTemplate<M, S>>;
    loadAll(meshDescriptors: MeshDescriptor<FileDescriptor>[]): Promise<unknown>;
}