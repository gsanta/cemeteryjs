import { ServiceLocator } from "../ServiceLocator";
import { Stores } from "../Stores";

export class LevelService {
    serviceName = 'level-service';
    private services: ServiceLocator;
    private getStores: () => Stores;

    constructor(services: ServiceLocator, getStores: () => Stores) {
        this.services = services;
        this.getStores = getStores;
    }

    changeLevel(level: number): Promise<void> {
        if (this.getStores().levelStore.hasLevel(level)) {
            this.getStores().viewStore.clear();
            return this.services.storageService().loadLevel(level)
                .finally(() => {
                    this.getStores().levelStore.setCurrentLevel(level)
                });
        } else {
            this.getStores().viewStore.clear();
            this.getStores().levelStore.setCurrentLevel(level);
            return Promise.resolve();
        }
    }

    updateCurrentLevel() {
        this.getStores().levelStore.currentLevel.isEmpty = false;
        this.services.storageService().storeLevel(this.getStores().levelStore.currentLevel.index);
    }

    removeCurrentLevel() {
        return this.services.storageService()
            .removeLevel(this.getStores().levelStore.currentLevel.index)
            .then(() => {
                this.getStores().viewStore.clear();
                this.getStores().levelStore.currentLevel.isEmpty = true;
            });
    }
}