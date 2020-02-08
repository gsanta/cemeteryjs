import { Scene } from "babylonjs/scene";
import { ModelFactory } from '../factories/ModelFactory';
import { Modifier } from "./Modifier";
import { TreeIteratorGenerator } from "../utils/TreeIteratorGenerator";
import { GameObject, WorldItemShape } from '../services/GameObject';
import { Mesh, Skeleton } from 'babylonjs';
import { AbstractModelLoader } from '../../common/AbstractModelLoader';
import { RectangleFactory } from '../factories/RectangleFactory';
import { MaterialFactory } from "../factories/MaterialFactory";
import { GameFacade } from '../../game/GameFacade';
import { MeshObject } from "../../game/models/objects/MeshObject";

export class CreateMeshModifier implements Modifier  {
    static modName = 'createMesh';
    private modelFactory: ModelFactory;
    private rectangleFactory: RectangleFactory;
    dependencies = [];

    constructor(scene: Scene, gameFacade: GameFacade) {
        this.modelFactory = new ModelFactory(scene, gameFacade);
        this.rectangleFactory = new RectangleFactory(scene, new MaterialFactory(scene), gameFacade, 0.1);
    }

    getName(): string {
        return CreateMeshModifier.modName;
    }

    apply(meshObjects: MeshObject[]): MeshObject[] {
        meshObjects.forEach(item => {
            this.modelFactory.createMesh(item);
        });

        return meshObjects;
    }
}