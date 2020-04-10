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

        this.getServices().conceptConvertService().convert();

        return this.getServices().modelLoaderService().loadAll(this.getStores().gameStore.getMeshObjects())
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
}