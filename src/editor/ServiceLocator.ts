import { LocalStore } from "./services/LocalStrore";
import { EventDispatcher } from "./common/EventDispatcher";
import { Editor } from "./Editor";
import { Stores } from "./Stores";
import { LevelService } from "./services/LevelService";
import { LevelStore } from "./common/stores/LevelStore";

export class ServiceLocator {
    private services: {serviceName: string}[] = [];

    //todo: get rid of it
    private eventDispatcher: EventDispatcher;
    
    constructor(editor: Editor, eventDispatcher: EventDispatcher, getStores: () => Stores) {
        this.services.push(new LocalStore(editor));
        this.services.push(new LevelService(this, getStores));

        this.eventDispatcher = eventDispatcher;
    }

    getService(serviceName: string) {
        return this.services.find(service => service.serviceName === serviceName);
    }

    storageService(): LocalStore {
        return <LocalStore> this.getService('local-store');
    }

    levelService(): LevelService {
        return <LevelService> this.getService('level-service');
    }

    dispatchService(): EventDispatcher {
        return this.eventDispatcher;
    }
}