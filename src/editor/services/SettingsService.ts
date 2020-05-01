import { AbstractSettings } from "../views/canvas/settings/AbstractSettings";
import { MeshSettings } from "../views/canvas/settings/MeshSettings";
import { PathSettings } from "../views/canvas/settings/PathSettings";
import { LevelSettings } from "../views/canvas/settings/LevelSettings";
import { Stores } from "../stores/Stores";
import { ServiceLocator } from "./ServiceLocator";
import { AnimationSettings } from "../views/canvas/settings/AnimationSettings";
import { Registry } from "../Registry";


export class SettingsService {
    serviceName = 'settings-service'
    protected settings: AbstractSettings<any>[] = [];

    constructor(registry: Registry) {
        this.settings = [
            new MeshSettings(registry),
            new PathSettings(),
            new LevelSettings(registry),
            new AnimationSettings(registry)
        ];
    }

    getSettingsByName<T extends AbstractSettings<any> = AbstractSettings<any>>(name: string) {
        return <T> this.settings.find(setting => setting.getName() === name);
    }
}