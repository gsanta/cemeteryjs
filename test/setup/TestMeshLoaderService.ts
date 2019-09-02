import { MeshLoaderService } from "../../src/services/MeshLoaderService";
import { MeshTemplate } from "../../src/MeshTemplate";
import { MeshDescriptor, FileDescriptor } from "../../src/Config";

export class TestMeshLoaderService implements MeshLoaderService<any, any> {
    meshTemplates: Map<string, MeshTemplate<any, any>> = new Map();

    loadAll(meshDescriptors: MeshDescriptor<FileDescriptor>[]): Promise<unknown> {
        throw new Error('Not implemented');
    }
}