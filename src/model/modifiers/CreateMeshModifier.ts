import { Scene } from "babylonjs/scene";
import { PolygonFactory } from '../../integrations/babylonjs/factories/PolygonFactory';
import { ModelFactory } from '../../integrations/babylonjs/factories/ModelFactory';
import { Modifier } from "./Modifier";
import { TreeIteratorGenerator } from "../utils/TreeIteratorGenerator";
import { WorldItem, WorldItemShape } from '../../WorldItem';
import { Mesh } from "babylonjs/Meshes/mesh";
import { TransformToWorldCoordinateModifier } from "./TransformToWorldCoordinateModifier";

export class CreateMeshModifier implements Modifier  {
    static modName = 'createMesh';
    private polygonFactory: PolygonFactory;
    private modelFactory: ModelFactory;
    dependencies = [];

    constructor(scene: Scene) {
        this.polygonFactory = new PolygonFactory(scene);
        this.modelFactory = new ModelFactory(scene);
    }

    getName(): string {
        return CreateMeshModifier.modName;
    }

    apply(worldItems: WorldItem[]): WorldItem[] {
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

    private creteMesh(worldItem: WorldItem): Mesh {
        switch(worldItem.shape) {
            case WorldItemShape.RECTANGLE:
                return this.polygonFactory.createMesh(worldItem);
            case WorldItemShape.MODEL:
                return this.modelFactory.createMesh(worldItem);
        }
    }
}