import { Scene } from "babylonjs/scene";
import { GameFacade } from '../GameFacade';
import { MeshObject } from "../models/objects/MeshObject";
import { ModelFactory } from './factories/ModelFactory';

export class CreateMeshModifier  {
    static modName = 'createMesh';
    private modelFactory: ModelFactory;
    dependencies = [];

    constructor(scene: Scene, gameFacade: GameFacade) {
        this.modelFactory = new ModelFactory(scene, gameFacade);
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