import { Skeleton } from "babylonjs";
import { Mesh } from "babylonjs/Meshes/mesh";
import { MeshDescriptor } from "../integrations/api/Config";
import { MeshFactoryService } from "../services/MeshFactoryService";
import { MeshTemplate } from "../integrations/api/MeshTemplate";
import { TreeIteratorGenerator } from "../utils/TreeIteratorGenerator";
import { WorldItem } from "../WorldItemInfo";
import { ChangeFurnitureSizeModifier } from './ChangeFurnitureSizeModifier';
import { Modifier } from './Modifier';
import { ModifierConfig } from './ModifierConfig';
import { MeshLoaderService } from '../services/MeshLoaderService';

export class CreateMeshModifier<M, S> implements Modifier {
    static modName = 'createMesh';
    dependencies = [ChangeFurnitureSizeModifier.modeName];

    private isReady = true;
    private descriptorMap: Map<string, MeshDescriptor> = new Map();
    private meshFactoryService: MeshFactoryService<M, S>;
    private meshLoaderService: MeshLoaderService<M, S>;

    constructor(meshFactoryService: MeshFactoryService<M, S>, meshLoaderService: MeshLoaderService<M, S>) {
        this.meshFactoryService = meshFactoryService;
        this.meshLoaderService = meshLoaderService;
    }

    getName(): string {
        return CreateMeshModifier.name;
    }

    public apply(worldItems: WorldItem[]): WorldItem[] {
        if (!this.isReady) {
            throw new Error('`MeshFactory` is not ready loading the models, please wait for the Promise returned from `loadModels` to resolve.');
        }

        worldItems.forEach(rootItem => {
            for (const item of TreeIteratorGenerator(rootItem)) {
                item.meshTemplate = {
                    meshes: this.createMesh(item),
                    skeletons: [],
                    type: item.name
                }
            }
        });

        return worldItems;
    }

    private createMesh(worldItemInfo: WorldItem): M[] {
        return this.meshFactoryService.getInstance(worldItemInfo, this.descriptorMap.get(worldItemInfo.name), this.meshLoaderService.meshTemplates);
    }
}