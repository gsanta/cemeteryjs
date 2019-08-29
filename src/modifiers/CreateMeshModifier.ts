import { Skeleton } from "babylonjs";
import { Mesh } from "babylonjs/Meshes/mesh";
import { MeshTemplate } from "../integrations/api/MeshTemplate";
import { MeshDescriptor, MeshFactory } from '../integrations/babylonjs/MeshFactory';
import { MeshLoader } from "../integrations/babylonjs/MeshLoader";
import { TreeIteratorGenerator } from "../utils/TreeIteratorGenerator";
import { WorldItemInfo } from "../WorldItemInfo";
import { Modifier } from './Modifier';

export class CreateMeshModifier implements Modifier {
    private meshFactory: MeshFactory;
    private meshLoader: MeshLoader;
    private isReady = true;
    private descriptorMap: Map<string, MeshDescriptor> = new Map();

    constructor(meshLoader: MeshLoader, meshFactory: MeshFactory) {
        this.meshLoader = meshLoader;
        this.meshFactory = meshFactory;
    }

    public prepareMeshTemplates(modelTypeDescriptions: MeshDescriptor[]): Promise<void> {
        this.isReady = false;

        this.createShapeTemplates(modelTypeDescriptions);
        return this.createModelTemplates(modelTypeDescriptions)
            .then(() => { this.isReady = true });
    }

    public apply(worldItems: WorldItemInfo[]): WorldItemInfo[] {
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

    private createShapeTemplates(modelTypeDescriptions: MeshDescriptor[]) {
        modelTypeDescriptions
            .forEach(desc => this.descriptorMap.set(desc.type, desc));
    }

    private createModelTemplates(modelTypeDescriptions: MeshDescriptor[]) {
        const fileDescriptions = modelTypeDescriptions
            .filter(desc => desc.details.name === 'file-descriptor');


        return Promise
            .all(fileDescriptions.map(desc => this.meshLoader.load(desc.type, desc)))
            .then((meshTemplates: MeshTemplate<Mesh, Skeleton>[]) => {
                const templateMap: Map<string, MeshTemplate<Mesh, Skeleton>> = new Map();
                meshTemplates.forEach(template => templateMap.set(template.type, template));
                this.meshFactory.setMeshTemplates(templateMap);
            });
    }

    private createMesh(worldItemInfo: WorldItemInfo): Mesh[] {
        return this.meshFactory.createFromMeshDescriptor(worldItemInfo, this.descriptorMap.get(worldItemInfo.name));

        // if (this.modelMap.has(worldItemInfo.name) || worldItemInfo.name === 'root' || worldItemInfo.name === 'empty' || worldItemInfo.name === 'wall') {
        //     return this.meshFactory.createFromTemplate(worldItemInfo, this.modelMap.get(worldItemInfo.name));
        // } else {

        // }
    }
}