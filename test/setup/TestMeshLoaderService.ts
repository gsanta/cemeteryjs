import { MeshLoaderService } from "../../src/services/MeshLoaderService";
import { MeshTemplate } from "../../src/integrations/api/MeshTemplate";
import { MeshDescriptor, FileDescriptor } from "../../src/integrations/api/Config";

export class TestMeshLoaderService implements MeshLoaderService<any, any> {
    meshTemplates: Map<string, MeshTemplate<any, any>> = new Map();

    loadAll(meshDescriptors: MeshDescriptor<FileDescriptor>[]): Promise<unknown> {
        throw new Error('Not implemented');
    }
}