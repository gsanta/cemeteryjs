import { ConfigService } from '../services/ConfigService';
import { MeshFactoryService } from "../services/MeshFactoryService";
import { MeshTemplateService } from '../services/MeshTemplateService';
import { TreeIteratorGenerator } from "../utils/TreeIteratorGenerator";
import { WorldItem } from "../../WorldItem";
import { ChangeFurnitureSizeModifier } from './ChangeFurnitureSizeModifier';
import { Modifier } from './Modifier';

export class CreateMeshModifier<M, S> implements Modifier {
    static modName = 'createMesh';
    dependencies = [ChangeFurnitureSizeModifier.modeName];

    private isReady = true;
    private meshFactoryService: MeshFactoryService<M, S>;
    private meshTemplateService: MeshTemplateService<M, S>;
    private configService: ConfigService;

    constructor(meshFactoryService: MeshFactoryService<M, S>, meshLoaderService: MeshTemplateService<M, S>, configService: ConfigService) {
        this.meshFactoryService = meshFactoryService;
        this.meshTemplateService = meshLoaderService;
        this.configService = configService;
    }

    getName(): string {
        return CreateMeshModifier.modName;
    }

    public apply(worldItems: WorldItem[]): WorldItem[] {
        if (!this.isReady) {
            throw new Error('`MeshFactory` is not ready loading the models, please wait for the Promise returned from `loadModels` to resolve.');
        }

        const skipTypes = ['_subarea'];

        const visitedItems: Set<WorldItem> = new Set();
        worldItems.forEach(rootItem => {
            for (const item of TreeIteratorGenerator(rootItem)) {
                if (!skipTypes.includes(item.name) && !visitedItems.has(item)) {
                    item.meshTemplate = {
                        meshes: this.createMesh(item),
                        skeletons: [],
                        type: item.name
                    }
                    visitedItems.add(item);
                }
            }
        });

        return worldItems;
    }

    private createMesh(worldItemInfo: WorldItem): M[] {
        if (worldItemInfo.name !== 'root') {
            return this.meshFactoryService.getInstance(worldItemInfo, this.configService.meshDescriptorMap.get(worldItemInfo.name), this.meshTemplateService.getTemplate(worldItemInfo.name));
        }

        return [];
    }
}