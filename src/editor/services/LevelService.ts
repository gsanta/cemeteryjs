import { ServiceLocator } from "./ServiceLocator";
import { Stores } from "../stores/Stores";
import { UpdateTask } from "./UpdateServices";

export class LevelService {
    serviceName = 'level-service';
    private getServices: () => ServiceLocator;
    private getStores: () => Stores;

    constructor(getServices: () => ServiceLocator, getStores: () => Stores) {
        this.getServices = getServices;
        this.getStores = getStores;
    }

    changeLevel(level: number): Promise<void> {
        this.clearStores();

        if (this.getStores().levelStore.hasLevel(level)) {
            return this.getServices().storage.loadLevel(level)
                .finally(() => {
                    this.getStores().levelStore.setCurrentLevel(level)
                    this.getServices().update.runImmediately(UpdateTask.All);
                });
        } else {
            this.getStores().levelStore.setCurrentLevel(level);
            this.getServices().update.runImmediately(UpdateTask.All)
            return Promise.resolve();
        }
    }

    updateCurrentLevel() {
        this.getStores().levelStore.currentLevel.isEmpty = false;
        const map = this.getServices().export.export();
        this.getServices().storage.storeLevel(this.getStores().levelStore.currentLevel.index, map);
    }

    clearLevel() {
        return this.getServices().storage
            .removeLevel(this.getStores().levelStore.currentLevel.index)
            .then(() => {
                this.clearStores();
                this.getStores().levelStore.currentLevel.isEmpty = true;
            });
    }

    private clearStores() {
        this.getServices().game.deleteConcepts(this.getStores().canvasStore.getAllConcepts());
        this.getStores().canvasStore.clear();
        this.getStores().hoverStore.clear();
        this.getStores().selectionStore.clear();
    }
}