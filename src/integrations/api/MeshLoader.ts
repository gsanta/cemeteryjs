import { MeshTemplate } from "./MeshTemplate";
import { MeshDescriptor, FileDescriptor } from "./Config";

export interface MeshLoader<M, S> {
    load(meshDescriptor: MeshDescriptor<FileDescriptor>): Promise<MeshTemplate<M,S>>;
}