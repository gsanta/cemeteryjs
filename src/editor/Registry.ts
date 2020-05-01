import { ServiceLocator } from "./services/ServiceLocator";
import { Stores } from "./stores/Stores";

export class Registry {
    stores: Stores = new Stores(this);
    services: ServiceLocator = new ServiceLocator(this);
}