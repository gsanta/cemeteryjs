import { Services } from "./services/ServiceLocator";
import { Stores } from "./stores/Stores";
import { Plugins } from "../plugins/Plugins";

export class Registry {
    stores: Stores;
    services: Services;
    plugins: Plugins;

    constructor() {
        this.stores = new Stores(this);
        this.services = new Services(this);
        this.services.setup();

        this.plugins = new Plugins(this);
    }
}