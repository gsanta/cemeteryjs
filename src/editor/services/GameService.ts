import { ServiceLocator } from "./ServiceLocator";
import { Stores } from "../stores/Stores";
import { Concept, ConceptType } from "../views/canvas/models/concepts/Concept";
import { MeshConcept } from "../views/canvas/models/concepts/MeshConcept";
import { GameEngine } from "../views/renderer/GameEngine";
import { RectangleFactory } from "../../game/import/factories/RectangleFactory";
import { GameObjectType } from "../../game/models/objects/IGameObject";
import { MeshObject } from "../../game/models/objects/MeshObject";

export class GameService {
    serviceName = 'game-service';
    gameEngine: GameEngine;
    
    private getServices: () => ServiceLocator;
    private getStores: () => Stores;

    constructor(canvas: HTMLCanvasElement, getServices: () => ServiceLocator, getStores: () => Stores) {
        this.getServices = getServices;
        this.getStores = getStores;
        this.gameEngine = new GameEngine(canvas);
    }

    resetPath(meshObjectName: string) {
        this.getStores().gameStore.getByName<MeshObject>(meshObjectName).getRoute().reset();
    }

    resetAllMovements() {
        this.getStores().gameStore.getRouteObjects().forEach(route => route.reset());
    }

    pauseMovement(meshObjectName: string) {
        this.getStores().gameStore.getByName<MeshObject>(meshObjectName).getRoute().isPaused = true;
    }

    pauseAllMovements() {
        this.getStores().gameStore.getRouteObjects().forEach(route => route.isPaused = true);
    }

    playMovement(meshObjectName: string) {
        this.getStores().gameStore.getByName<MeshObject>(meshObjectName).getRoute().isPaused = false;
    }

    playAllMovements() {
        this.getStores().gameStore.getRouteObjects().forEach(route => route.isPaused = false);
    }

    importAllConcepts() {
        this.getStores().gameStore.clear();

        this.getStores().canvasStore.getAllConcepts().forEach(concept => this.getServices().conceptConvertService().convert(concept));

        this.getServices().meshLoaderService().loadAll(this.getStores().gameStore.getMeshObjects())
            .then(() => {
                this.getStores().gameStore.getMeshObjects().forEach(meshObject => {
                    if (!meshObject.modelPath) {
                        new RectangleFactory(this.getServices, this.getStores, 0.1).createMesh(meshObject);
                    } else {
                        this.getServices().meshLoaderService().createInstance(meshObject)
                    }
                });
            });
    }

    deleteConcepts(concepts: Concept[]) {
        concepts.forEach(concept => {
            this.getStores().gameStore.deleteById(concept.id);

            if (concept.type === ConceptType.MeshConcept) {
                this.getStores().meshStore.deleteMesh((<MeshConcept> concept).id);
            }
        });
    }

    addConcept(concept: Concept) {
        const gameObject = this.getServices().conceptConvertService().convert(concept);

        switch(gameObject.objectType) {
            case GameObjectType.MeshObject:
                const meshObject = <MeshObject> gameObject;
                if (!meshObject.modelPath) {
                    new RectangleFactory(this.getServices, this.getStores, 0.1).createMesh(meshObject);
                } else {
                    this.getServices().meshLoaderService().load(<MeshObject> gameObject).then(() => this.getServices().meshLoaderService().createInstance(meshObject));
                }
            break;
        }
    }

    updateConcept(concept: Concept) {
        this.deleteConcepts([concept]);
        this.addConcept(concept);
    }
}