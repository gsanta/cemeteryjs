import { UI_Plugin, UI_Region } from '../UI_Plugin';
import { Registry } from '../Registry';

export class PluginService {
    private plugins: Map<string, UI_Plugin> = new Map();

    private registeredPlugins: Map<UI_Region, UI_Plugin[]> = new Map();
    private showedPlugins: Map<UI_Region, UI_Plugin[]> = new Map();

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;

        UI_Region.all().forEach(region => {
            this.registeredPlugins.set(region, []);
            this.showedPlugins.set(region, []);
        });
    }

    findPluginsAtRegion(region: UI_Region): UI_Plugin[] {
        return this.showedPlugins.get(region);
    }

    findPlugin(pluginId: string): UI_Plugin {
        return this.plugins.get(pluginId);
    }

    showPlugin(pluginId: string) {
        const plugin = this.plugins.get(pluginId);
        if (UI_Region.isSinglePluginRegion(plugin.region)) {
            this.showedPlugins.get(plugin.region)[0] = plugin;
        } else {
            this.showedPlugins.get(plugin.region).push(plugin);
        }
        this.registry.services.ui.scheduleUpdate(UI_Region.Dialog);
    }

    hidePlugin(pluginId: string) {
        const plugin = this.plugins.get(pluginId);
        const index = this.showedPlugins.get(plugin.region).indexOf(plugin);
        this.showedPlugins.get(plugin.region).splice(index, 1);

        this.registry.services.ui.scheduleUpdate(UI_Region.Dialog);
    }

    registerPlugin(plugin: UI_Plugin) {
        this.plugins.set(plugin.id, plugin);
        this.registeredPlugins.get(plugin.region).push(plugin);
    }
}