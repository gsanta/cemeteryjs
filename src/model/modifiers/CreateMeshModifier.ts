import { Scene } from "babylonjs/scene";
import { PolygonFactory } from '../factories/PolygonFactory';
import { ModelFactory } from '../factories/ModelFactory';
import { Modifier } from "./Modifier";
import { TreeIteratorGenerator } from "../utils/TreeIteratorGenerator";
import { GameObject, WorldItemShape } from '../types/GameObject';
import { Mesh } from "babylonjs";
import { ModelLoader } from '../services/ModelLoader';

export class CreateMeshModifier implements Modifier  {
    static modName = 'createMesh';
    private polygonFactory: PolygonFactory;
    private modelFactory: ModelFactory;
    dependencies = [];

    constructor(scene: Scene, modelLoader: ModelLoader) {
        this.polygonFactory = new PolygonFactory(scene);
        this.modelFactory = new ModelFactory(scene, modelLoader);
    }

    getName(): string {
        return CreateMeshModifier.modName;
    }

    apply(worldItems: GameObject[]): GameObject[] {
        worldItems.forEach(rootItem => {
            for (const item of TreeIteratorGenerator(rootItem)) {
                item.meshTemplate = {
                    meshes: [this.creteMesh(item)],
                    skeletons: [],
                    type: item.name
                }
            }
        });

        return worldItems;
    }

    private creteMesh(worldItem: GameObject): Mesh {
        switch(worldItem.shape) {
            case WorldItemShape.RECTANGLE:
                return this.polygonFactory.createMesh(worldItem);
            case WorldItemShape.MODEL:
                return this.modelFactory.createMesh(worldItem);
        }
    }

    // private createFromModel() {
    //     this.modelImportService.getModelByPath(worldItem.modelPath).mesh;
    // }
}