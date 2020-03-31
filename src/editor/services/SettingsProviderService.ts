import { AbstractSettings } from "../views/canvas/settings/AbstractSettings";
import { MeshSettings } from "../views/canvas/settings/MeshSettings";
import { PathSettings } from "../views/canvas/settings/PathSettings";
import { LevelSettings } from "../views/canvas/settings/LevelSettings";
import { Stores } from "../stores/Stores";
import { ServiceLocator } from "./ServiceLocator";


export class SettingsProviderService {
    protected settings: AbstractSettings<any>[] = [];

    constructor(getStores: () => Stores, getServices: () => ServiceLocator) {
        this.settings = [
            new MeshSettings(this, getServices, getStores),
            new PathSettings(),
            new LevelSettings(getServices, this.getStores)
        ];
    }

    getSettingsByName<T extends AbstractSettings<any> = AbstractSettings<any>>(name: string) {
        return <T> this.settings.find(setting => setting.getType() === name);
    }
}