import { AbstractSettings } from "../ui_plugins/AbstractSettings";

export class PluginSettings {

    dialogController: AbstractSettings<any>;

    settings: AbstractSettings<any>[] = [];
    private settingsMap: Map<string, AbstractSettings> = new Map();

    constructor(settings: AbstractSettings[]) {
        this.settings = settings;
        this.settings.forEach(settings => this.settingsMap.set(settings.getName(), settings));
    }

    byName<T extends AbstractSettings = AbstractSettings>(settingsName: string) {
        const settings = this.settings.find(setting => setting.getName() === settingsName);
        if (!settings) { this.throwServiceNotFoundError(settingsName); }

        return <T> settings;
    }

    private throwServiceNotFoundError(serviceName: string) {
        throw new Error(`Service '${serviceName}' not found.`);
    }
}