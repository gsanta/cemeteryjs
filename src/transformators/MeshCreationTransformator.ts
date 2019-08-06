import { Skeleton } from "babylonjs";
import { Mesh } from "babylonjs/Meshes/mesh";
import { MeshTemplate } from "../integrations/api/MeshTemplate";
import { FileDescriptor, ModelDescriptor, MeshFactory, ShapeDescriptor } from '../integrations/babylonjs/MeshFactory';
import { MeshLoader } from "../integrations/babylonjs/MeshLoader";
import { TreeIteratorGenerator } from "../utils/TreeIteratorGenerator";
import { WorldItemInfo } from "../WorldItemInfo";

export class MeshCreationTransformator {
    private modelFactory: MeshFactory;
    private modelFileLoader: MeshLoader;
    private isReady = true;
    private modelMap: Map<string, MeshTemplate<Mesh, Skeleton>> = new Map();
    private shapeMap: Map<string, ShapeDescriptor> = new Map();

    constructor(modelFileLoader: MeshLoader, modelFactory: MeshFactory) {
        this.modelFileLoader = modelFileLoader;
        this.modelFactory = modelFactory;
    }

    public prepareMeshTemplates(modelTypeDescriptions: ModelDescriptor[]): Promise<void> {
        this.isReady = false;

        this.createShapeTemplates(modelTypeDescriptions);
        return this.createModelTemplates(modelTypeDescriptions)
            .then(() => { this.isReady = true });
    }

    public transform(worldItems: WorldItemInfo[]): WorldItemInfo[] {
        if (!this.isReady) {
            throw new Error('`MeshFactory` is not ready loading the models, please wait for the Promise returned from `loadModels` to resolve.');
        }

        worldItems.forEach(rootItem => {
            for (const item of TreeIteratorGenerator(rootItem)) {
                item.meshTemplate = {
                    meshes: [this.createMesh(item)],
                    skeletons: [],
                    type: item.name
                }
            }
        });

        return worldItems;
    }

    private createShapeTemplates(modelTypeDescriptions: ModelDescriptor[]) {
        modelTypeDescriptions
            .filter(desc => desc.details.name === 'shape-descriptor')
            .forEach(desc => this.shapeMap.set(desc.type, <ShapeDescriptor>desc.details));
    }

    private createModelTemplates(modelTypeDescriptions: ModelDescriptor[]) {
        const fileDescriptions = modelTypeDescriptions
            .filter(desc => desc.details.name === 'file-descriptor');


        return Promise
            .all(fileDescriptions.map(desc => this.modelFileLoader.load(desc.type, <FileDescriptor>desc.details)))
            .then((meshTemplates: MeshTemplate<Mesh, Skeleton>[]) => {
                meshTemplates.forEach(template => this.modelMap.set(template.type, template));
            });
    }

    private createMesh(worldItemInfo: WorldItemInfo): Mesh {

        if (this.modelMap.has(worldItemInfo.name)) {
            return this.modelFactory.createFromTemplate(worldItemInfo, this.modelMap.get(worldItemInfo.name));
        } else if (this.shapeMap.has(worldItemInfo.type)) {
            return this.modelFactory.createFromShapeDescriptor(worldItemInfo, this.shapeMap.get(worldItemInfo.name));
        } else {
            throw new Error('Unsupported type: ' + worldItemInfo.name);
        }
    }
}