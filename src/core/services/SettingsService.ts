import { AbstractSettings } from "../../editor/views/canvas/settings/AbstractSettings";
import { MeshSettings } from "../../editor/views/canvas/settings/MeshSettings";
import { PathSettings } from "../../editor/views/canvas/settings/PathSettings";
import { LevelSettings } from "../../editor/views/canvas/settings/LevelSettings";
import { Stores } from "../stores/Stores";
import { ServiceLocator } from "./ServiceLocator";
import { AnimationSettings } from "../../editor/views/canvas/settings/AnimationSettings";
import { Registry } from "../../editor/Registry";
import { ActionSettings } from '../../plugins/action_editor/settings/ActionEditorSettings';


export class SettingsService {
    serviceName = 'settings-service'
    animationSettings: AnimationSettings;

    protected settings: AbstractSettings<any>[] = [];

    constructor(registry: Registry) {
        this.animationSettings = new AnimationSettings(registry);
        this.settings = [
            new MeshSettings(registry),
            new PathSettings(),
            new LevelSettings(registry),
            this.animationSettings,
        ];
    }

    getSettingsByName<T extends AbstractSettings<any> = AbstractSettings<any>>(name: string) {
        return <T> this.settings.find(setting => setting.getName() === name);
    }
}