import { Skeleton } from "babylonjs";
import { Mesh } from "babylonjs/Meshes/mesh";
import { MeshDescriptor } from "../Config";
import { MeshFactoryService } from "../services/MeshFactoryService";
import { MeshTemplate } from "../MeshTemplate";
import { TreeIteratorGenerator } from "../utils/TreeIteratorGenerator";
import { WorldItem } from "../WorldItem";
import { ChangeFurnitureSizeModifier } from './ChangeFurnitureSizeModifier';
import { Modifier } from './Modifier';
import { ModifierConfig } from './ModifierConfig';
import { MeshLoaderService } from '../services/MeshLoaderService';
import { ConfigService } from '../services/ConfigService';

export class CreateMeshModifier<M, S> implements Modifier {
    static modName = 'createMesh';
    dependencies = [ChangeFurnitureSizeModifier.modeName];

    private isReady = true;
    private meshFactoryService: MeshFactoryService<M, S>;
    private meshLoaderService: MeshLoaderService<M, S>;
    private configService: ConfigService;

    constructor(meshFactoryService: MeshFactoryService<M, S>, meshLoaderService: MeshLoaderService<M, S>, configService: ConfigService) {
        this.meshFactoryService = meshFactoryService;
        this.meshLoaderService = meshLoaderService;
        this.configService = configService;
    }

    getName(): string {
        return CreateMeshModifier.modName;
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
        return this.meshFactoryService.getInstance(worldItemInfo, this.configService.meshDescriptorMap.get(worldItemInfo.name), this.meshLoaderService.meshTemplates);
    }
}