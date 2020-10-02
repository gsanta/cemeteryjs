import { Bab_EngineFacade } from "./adapters/babylonjs/Bab_EngineFacade";
import { IEngineFacade } from "./adapters/IEngineFacade";
import { Plugins } from "./plugin/Plugins";
import { defaultPreferences, Preferences } from './preferences/Preferences';
import { Services } from "./services/Services";
import { Stores } from "./stores/Stores";

export class Registry {
    stores: Stores;
    services: Services;
    plugins: Plugins;    
    // ui_regions: UI_Regions;
    preferences: Preferences = defaultPreferences;
    engine: IEngineFacade;

    constructor() {
        this.stores = new Stores(this);
        this.services = new Services(this);
        this.services.setup();

        this.plugins = new Plugins(this);
        this.engine = new Bab_EngineFacade(this);
    }
}