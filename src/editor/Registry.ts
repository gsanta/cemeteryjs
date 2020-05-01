import { ServiceLocator } from "./services/ServiceLocator";
import { Stores } from "./stores/Stores";


export class Registry {
    services: ServiceLocator;
    stores: Stores = new Stores(this);
}