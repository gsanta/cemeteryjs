import { AbstractSettings } from "../views/canvas/settings/AbstractSettings";
import { MeshSettings } from "../views/canvas/settings/MeshSettings";
import { PathSettings } from "../views/canvas/settings/PathSettings";
import { LevelSettings } from "../views/canvas/settings/LevelSettings";
import { Stores } from "../stores/Stores";
import { ServiceLocator } from "./ServiceLocator";
import { AnimationSettings } from "../views/canvas/settings/AnimationSettings";


export class SettingsService {
    serviceName = 'settings-service'
    protected settings: AbstractSettings<any>[] = [];

    constructor(getServices: () => ServiceLocator, getStores: () => Stores) {
        this.settings = [
            new MeshSettings(getServices, getStores),
            new PathSettings(),
            new LevelSettings(getServices, getStores),
            new AnimationSettings(getServices, getStores)
        ];
    }

    getSettingsByName<T extends AbstractSettings<any> = AbstractSettings<any>>(name: string) {
        return <T> this.settings.find(setting => setting.getName() === name);
    }
}