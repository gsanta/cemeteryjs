import { ServiceLocator } from "../core/services/ServiceLocator";
import { Stores } from "../core/stores/Stores";

export class Registry {
    stores: Stores;
    services: ServiceLocator;

    constructor() {
        this.stores = new Stores(this); 
        this.services = new ServiceLocator(this);
        this.services.setup();
    }
}