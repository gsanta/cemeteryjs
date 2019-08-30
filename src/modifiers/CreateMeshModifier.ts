import { Skeleton } from "babylonjs";
import { Mesh } from "babylonjs/Meshes/mesh";
import { MeshDescriptor } from "../integrations/api/Config";
import { MeshFactory } from "../integrations/api/MeshFactory";
import { MeshTemplate } from "../integrations/api/MeshTemplate";
import { TreeIteratorGenerator } from "../utils/TreeIteratorGenerator";
import { WorldItem } from "../WorldItemInfo";
import { ChangeFurnitureSizeModifier } from './ChangeFurnitureSizeModifier';
import { Modifier } from './Modifier';
import { ModifierConfig } from './ModifierConfig';

export class CreateMeshModifier<M, S> implements Modifier {
    static modName = 'createMesh';
    dependencies = [ChangeFurnitureSizeModifier.modeName];

    private isReady = true;
    private descriptorMap: Map<string, MeshDescriptor> = new Map();
    private templateMap: Map<string, MeshTemplate<Mesh, Skeleton>>;
    private meshFactory: MeshFactory<M, S>;

    constructor(modifierConfig: ModifierConfig<M, S>) {
        this.meshFactory = modifierConfig.meshFactory;
        this.templateMap = modifierConfig.templateMap;
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

    private createMesh(worldItemInfo: WorldItem): Mesh[] {
        return this.meshFactory.getInstance(worldItemInfo, this.descriptorMap.get(worldItemInfo.name), this.templateMap);

        // if (this.modelMap.has(worldItemInfo.name) || worldItemInfo.name === 'root' || worldItemInfo.name === 'empty' || worldItemInfo.name === 'wall') {
        //     return this.meshFactory.createFromTemplate(worldItemInfo, this.modelMap.get(worldItemInfo.name));
        // } else {

        // }
    }
}