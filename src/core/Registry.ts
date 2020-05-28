import { Services } from "./services/ServiceLocator";
import { Stores } from "./stores/Stores";
import { Tools } from "../plugins/Tools";

export class Registry {
    stores: Stores;
    services: Services;
    tools: Tools;
    

    constructor() {
        this.stores = new Stores(this);
        this.tools = new Tools(this); 
        this.services = new Services(this);
        this.services.setup();
    }
}