import { Services } from "./services/ServiceLocator";
import { Stores } from "./stores/Stores";
import { Views } from "../plugins/Views";
import { Tools } from "../plugins/Tools";

export class Registry {
    stores: Stores;
    services: Services;
    tools: Tools;
    views: Views;

    constructor() {
        this.stores = new Stores(this);
        this.tools = new Tools(this); 
        this.views = new Views(this);
        this.services = new Services(this);
        this.services.setup();
    }
}