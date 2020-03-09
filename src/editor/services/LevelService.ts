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
        if (this.getStores().levelStore.hasLevel(level)) {
            this.getStores().conceptStore.clear();
            return this.getServices().storageService().loadLevel(level)
                .finally(() => {
                    this.getStores().levelStore.setCurrentLevel(level)
                    this.getServices().updateService().runImmediately(UpdateTask.All);
                });
        } else {
            this.getStores().conceptStore.clear();
            this.getStores().levelStore.setCurrentLevel(level);
            this.getServices().updateService().runImmediately(UpdateTask.All)
            return Promise.resolve();
        }
    }

    updateCurrentLevel() {
        this.getStores().levelStore.currentLevel.isEmpty = false;
        const map = this.getServices().exportService().export();
        this.getServices().storageService().storeLevel(this.getStores().levelStore.currentLevel.index, map);
        this.getServices().historyService().saveState(map);
    }

    removeCurrentLevel() {
        return this.getServices().storageService()
            .removeLevel(this.getStores().levelStore.currentLevel.index)
            .then(() => {
                this.getStores().conceptStore.clear();
                this.getStores().levelStore.currentLevel.isEmpty = true;
            });
    }
}