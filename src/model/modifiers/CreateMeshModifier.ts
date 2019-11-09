import { ConfigService } from '../services/ConfigService';
import { MeshFactoryService } from "../services/MeshFactoryService";
import { MeshTemplateService } from '../services/MeshTemplateService';
import { TreeIteratorGenerator } from "../utils/TreeIteratorGenerator";
import { WorldItem } from "../../WorldItem";
import { ChangeFurnitureSizeModifier } from './ChangeFurnitureSizeModifier';
import { Modifier } from './Modifier';
import { ServiceFacade } from '../services/ServiceFacade';

export class CreateMeshModifier<M, S> implements Modifier {
    static modName = 'createMesh';
    dependencies = [ChangeFurnitureSizeModifier.modeName];

    private isReady = true;
    private services: ServiceFacade<any, any, any>;

    constructor(services: ServiceFacade<any, any, any>) {
        this.services = services;
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
            const configService = this.services.configService;
            const meshTemplateService = this.services.meshTemplateService;
            return this.services.meshFactoryService.getInstance(worldItemInfo, configService.meshDescriptorMap.get(worldItemInfo.name), meshTemplateService.getTemplate(worldItemInfo.name));
        }

        return [];
    }
}