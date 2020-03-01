import { LocalStore } from "./services/LocalStrore";
import { EventDispatcher } from "./common/EventDispatcher";

export class ServiceLocator {
    private services: {serviceName: string}[] = [];

    //todo: get rid of it
    private eventDispatcher: EventDispatcher;
    
    constructor(eventDispatcher: EventDispatcher) {
        this.services.push(new LocalStore());

        this.eventDispatcher = eventDispatcher;
    }

    getService(serviceName: string) {
        return this.services.find(service => service.serviceName === serviceName);
    }

    storageService(): LocalStore {
        return <LocalStore> this.getService('local-store');
    }

    dispatchService(): EventDispatcher {
        return this.eventDispatcher;
    }
}