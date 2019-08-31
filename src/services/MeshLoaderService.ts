import { MeshTemplate } from "../integrations/api/MeshTemplate";
import { MeshDescriptor, FileDescriptor } from "../integrations/api/Config";

export interface MeshLoaderService<M, S> {
    meshTemplates: Map<string, MeshTemplate<M, S>>;
    load(meshDescriptor: MeshDescriptor<FileDescriptor>): Promise<MeshTemplate<M,S>>;
}