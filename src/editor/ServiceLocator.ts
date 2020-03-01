import { LocalStore } from "./services/LocalStrore";
import { EventDispatcher } from "./common/EventDispatcher";
import { Editor } from "./Editor";

export class ServiceLocator {
    private services: {serviceName: string}[] = [];

    //todo: get rid of it
    private eventDispatcher: EventDispatcher;
    
    constructor(editor: Editor, eventDispatcher: EventDispatcher) {
        this.services.push(new LocalStore(editor));

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