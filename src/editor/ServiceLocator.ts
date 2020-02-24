import { LocalStore } from "./services/LocalStrore";

export class ServiceLocator {
    private services: {serviceName: string}[] = [];
    
    constructor() {
        this.services.push(new LocalStore());
    }

    getService(serviceName: string) {
        return this.services.find(service => service.serviceName === serviceName);
    }

    storageService(): LocalStore {
        return <LocalStore> this.getService('local-store');
    }
}