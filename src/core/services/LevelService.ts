import { Registry } from "../Registry";
import { RenderTask } from "./RenderServices";

export class LevelService {
    serviceName = 'level-service';
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }
    
    changeLevel(level: number): Promise<void> {
        this.clearStores();

        if (this.registry.stores.levelStore.hasLevel(level)) {
            return this.registry.services.localStore.loadLevel(level)
                .finally(() => {
                    this.registry.stores.levelStore.setCurrentLevel(level)
                    this.registry.services.render.reRenderAll();
                });
        } else {
            this.registry.stores.levelStore.setCurrentLevel(level);
            this.registry.services.render.reRenderAll()
            return Promise.resolve();
        }
    }

    updateCurrentLevel() {
        this.registry.stores.levelStore.currentLevel.isEmpty = false;
    }

    clearLevel() {
        return this.registry.services.localStore
            .removeLevel(this.registry.stores.levelStore.currentLevel.index)
            .then(() => {
                this.clearStores();
                this.registry.stores.levelStore.currentLevel.isEmpty = true;
            });
    }

    private clearStores() {
        this.registry.stores.clear();
    }
}