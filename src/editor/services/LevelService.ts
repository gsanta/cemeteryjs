import { ServiceLocator } from "../ServiceLocator";
import { Stores } from "../Stores";
import { UpdateTask } from "../common/services/UpdateServices";

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
            this.getStores().viewStore.clear();
            return this.getServices().storageService().loadLevel(level)
                .finally(() => {
                    this.getStores().levelStore.setCurrentLevel(level)
                    this.getServices().updateService().runImmediately(UpdateTask.All);
                });
        } else {
            this.getStores().viewStore.clear();
            this.getStores().levelStore.setCurrentLevel(level);
            this.getServices().updateService().runImmediately(UpdateTask.All)
            return Promise.resolve();
        }
    }

    updateCurrentLevel() {
        this.getStores().levelStore.currentLevel.isEmpty = false;
        this.getServices().storageService().storeLevel(this.getStores().levelStore.currentLevel.index);
    }

    removeCurrentLevel() {
        return this.getServices().storageService()
            .removeLevel(this.getStores().levelStore.currentLevel.index)
            .then(() => {
                this.getStores().viewStore.clear();
                this.getStores().levelStore.currentLevel.isEmpty = true;
            });
    }
}