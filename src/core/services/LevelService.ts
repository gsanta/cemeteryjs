import { Registry } from "../Registry";
import { RenderTask } from "./RenderServices";

export class LevelService {
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }
    
    changeLevel(level: number): Promise<void> {
        this.registry.data.clearData();

        if (this.registry.stores.levelStore.hasLevel(level)) {
            return this.registry.services.localStore.loadLevel(level)
                .catch(e => {
                    1
                    console.log(e);
                })
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
                this.registry.data.clearData();
                this.registry.stores.levelStore.currentLevel.isEmpty = true;
            });
    }
}