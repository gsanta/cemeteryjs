import { AbstractSettings } from "../views/canvas/settings/AbstractSettings";
import { MeshSettings } from "../views/canvas/settings/MeshSettings";
import { PathSettings } from "../views/canvas/settings/PathSettings";
import { LevelSettings } from "../views/canvas/settings/LevelSettings";
import { Stores } from "../stores/Stores";
import { ServiceLocator } from "./ServiceLocator";
import { AnimationSettings } from "../views/canvas/settings/AnimationSettings";
import { Registry } from "../Registry";
import { ActionSettings } from '../views/canvas/settings/ActionSettings';


export class SettingsService {
    serviceName = 'settings-service'
    animationSettings: AnimationSettings;
    actionSettings: ActionSettings;

    protected settings: AbstractSettings<any>[] = [];

    constructor(registry: Registry) {
        this.animationSettings = new AnimationSettings(registry);
        this.actionSettings = new ActionSettings(registry);
        this.settings = [
            new MeshSettings(registry),
            new PathSettings(),
            new LevelSettings(registry),
            this.animationSettings,
            this.actionSettings
        ];
    }

    getSettingsByName<T extends AbstractSettings<any> = AbstractSettings<any>>(name: string) {
        return <T> this.settings.find(setting => setting.getName() === name);
    }
}