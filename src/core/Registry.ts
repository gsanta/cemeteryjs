import { Bab_EngineFacade } from "./engine/adapters/babylonjs/Bab_EngineFacade";
import { IEngineFacade } from "./engine/IEngineFacade";
import { Wrap_EngineFacade } from "./engine/adapters/wrapper/Wrap_EngineFacade";
import { Plugins } from "./models/Plugins";
import { defaultPreferences, Preferences } from './preferences/Preferences';
import { Services } from "./services/Services";
import { Stores } from "./data/stores/Stores";
import { DataLookup } from "./data/DataLookup";
import { UI_Lookup } from "./data/UI_Lookup";

export class Registry {
    stores: Stores;
    services: Services;
    plugins: Plugins;    
    preferences: Preferences = defaultPreferences;
    engine: IEngineFacade;

    data: DataLookup;
    ui: UI_Lookup;

    constructor() {
        this.stores = new Stores(this);
        this.services = new Services(this);
        this.services.setup();

        this.plugins = new Plugins(this);

        this.data = new DataLookup(this);
        this.ui = new UI_Lookup();
        
        this.engine = new Bab_EngineFacade(this, 'Main Engine');
    }
}