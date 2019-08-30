import { MeshTemplate } from "./MeshTemplate";
import { Mesh } from "babylonjs/Meshes/mesh";
import { MeshDescriptor, FileDescriptor } from '../babylonjs/MeshFactory';


export interface MeshLoader<M, S> {
    load(meshDescriptor: MeshDescriptor<FileDescriptor>): Promise<MeshTemplate<M,S>>;
}