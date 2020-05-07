import { Registry } from "../../editor/Registry";
import { UpdateTask } from "./UpdateServices";

export class LevelService {
    serviceName = 'level-service';
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }
    
    changeLevel(level: number): Promise<void> {
        this.clearStores();

        if (this.registry.stores.levelStore.hasLevel(level)) {
            return this.registry.services.storage.loadLevel(level)
                .finally(() => {
                    this.registry.stores.levelStore.setCurrentLevel(level)
                    this.registry.services.update.runImmediately(UpdateTask.All);
                });
        } else {
            this.registry.stores.levelStore.setCurrentLevel(level);
            this.registry.services.update.runImmediately(UpdateTask.All)
            return Promise.resolve();
        }
    }

    updateCurrentLevel() {
        this.registry.stores.levelStore.currentLevel.isEmpty = false;
        const map = this.registry.services.export.export();
        this.registry.services.storage.storeLevel(this.registry.stores.levelStore.currentLevel.index, map);
    }

    clearLevel() {
        return this.registry.services.storage
            .removeLevel(this.registry.stores.levelStore.currentLevel.index)
            .then(() => {
                this.clearStores();
                this.registry.stores.levelStore.currentLevel.isEmpty = true;
            });
    }

    private clearStores() {
        this.registry.services.game.deleteConcepts(this.registry.stores.canvasStore.getAllConcepts());
        this.registry.stores.canvasStore.clear();
        this.registry.stores.hoverStore.clear();
        this.registry.stores.selectionStore.clear();
    }
}