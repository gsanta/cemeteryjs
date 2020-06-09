import { Services } from "./services/ServiceLocator";
import { Stores } from "./stores/Stores";
import { Tools } from "../plugins/Tools";

export class Registry {
    stores: Stores;
    services: Services;

    constructor() {
        this.stores = new Stores(this);
        this.services = new Services(this);
        this.services.setup();
    }
}