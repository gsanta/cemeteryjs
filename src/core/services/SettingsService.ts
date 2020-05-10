import { AbstractSettings } from "../../plugins/scene_editor/settings/AbstractSettings";
import { MeshSettings } from "../../plugins/scene_editor/settings/MeshSettings";
import { PathSettings } from "../../plugins/scene_editor/settings/PathSettings";
import { LevelSettings } from "../../plugins/scene_editor/settings/LevelSettings";
import { Stores } from "../stores/Stores";
import { Services } from "./ServiceLocator";
import { AnimationSettings } from "../../plugins/scene_editor/settings/AnimationSettings";
import { Registry } from "../Registry";
import { ActionEditorSettings } from '../../plugins/action_editor/settings/ActionEditorSettings';


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