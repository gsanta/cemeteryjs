import { ServiceLocator } from "./services/ServiceLocator";
import { Stores } from "./stores/Stores";

export class Registry {
    stores: Stores;
    services: ServiceLocator;

    constructor() {
        this.stores = new Stores(this); 
        this.services = new ServiceLocator(this);
        this.services.setup();
    }
}