import { Services } from "./services/ServiceLocator";
import { Stores } from "./stores/Stores";
import { Plugins } from "../plugins/Plugins";
import { IControlledObject, ObjectCapability } from './IControlledObject';
import { IListener } from './IListener';

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

    registerObject(object: IControlledObject) {
        if (ObjectCapability.hasObjectCapability(object, ObjectCapability.Listener)) {
            this.services.event.addListener(<IListener> <unknown> object)
        }
    }

    unregisterObject(object: IControlledObject) {
        if (ObjectCapability.hasObjectCapability(object, ObjectCapability.Listener)) {
            this.services.event.removeListener(<IListener> <unknown> object)
        }
    }
}