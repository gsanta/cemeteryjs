import { MeshObject } from "./models/objects/MeshObject";
import { MeshObjectUpdater } from "./MeshObjectUpdater";
import { GameEngine } from "../editor/views/renderer/GameEngine";
import { ServiceLocator } from "../editor/services/ServiceLocator";
import { Stores } from "../editor/stores/Stores";
import { IConceptConverter } from "./models/objects/IConceptConverter";
import { MeshConceptConverter } from "./models/objects/MeshConceptConverter";
import { PathConceptConverter } from "./models/objects/PathConceptConverter";
import { RectangleFactory } from "./import/factories/RectangleFactory";
import { MaterialFactory } from "./import/factories/MaterialFactory";
import { Concept, ConceptType } from "../editor/views/canvas/models/concepts/Concept";
import { MeshConcept } from "../editor/views/canvas/models/concepts/MeshConcept";
import { GameObjectType } from "./models/objects/IGameObject";

export class GameService {
    serviceName = 'game-service';
    gameEngine: GameEngine;
    
    meshObjectUpdater: MeshObjectUpdater;

    private getServices: () => ServiceLocator;
    private getStores: () => Stores;

    private conceptConverters: IConceptConverter[] = []

    constructor(canvas: HTMLCanvasElement, getServices: () => ServiceLocator, getStores: () => Stores) {
        this.getServices = getServices;
        this.getStores = getStores;
        this.meshObjectUpdater = new MeshObjectUpdater(this.getStores);
        this.gameEngine = new GameEngine(canvas);

        this.conceptConverters = [
            new MeshConceptConverter(getStores),
            new PathConceptConverter(getStores)
        ]
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

        this.getServices().modelLoaderService().loadAll(this.getStores().gameStore.getMeshObjects())
            .then(() => {
                this.getStores().gameStore.getMeshObjects().forEach(meshObject => {
                    if (!meshObject.modelPath) {
                        new RectangleFactory(this.getServices, this.getStores, 0.1).createMesh(meshObject);
                    } else {
                        this.getServices().modelLoaderService().createInstance(meshObject)
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
                    this.getServices().modelLoaderService().load(<MeshObject> gameObject).then(() => this.getServices().modelLoaderService().createInstance(meshObject));
                }
            break;
        }
    }

    updateConcept(concept: Concept) {
        this.deleteConcepts([concept]);
        this.addConcept(concept);
    }
}