import { UI_Plugin, UI_Region } from '../UI_Plugin';
import { Registry } from '../Registry';
import { RenderTask } from './RenderServices';
import { AbstractSidepanelPlugin } from '../AbstractSidepanelPlugin';

export class PluginService {
    private plugins: UI_Plugin[] = [];
    private activePlugins: UI_Plugin[] = [];

    // private showedPlugins: Map<UI_Region, UI_Plugin[]> = new Map();

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    getActivePlugins(region?: UI_Region): UI_Plugin[] {
        if (region) {
            return this.activePlugins.filter(activePlugin => activePlugin.region === region);
        }
        return this.activePlugins;
    }

    findPlugin(pluginId: string): UI_Plugin {
        return this.plugins.find(plugin => plugin.id === pluginId);
    } 

    activatePlugin(pluginId: string) {
        const plugin = this.findPlugin(pluginId);
        if (UI_Region.isSinglePluginRegion(plugin.region)) {
            this.activePlugins = this.activePlugins.filter(activePlugin => activePlugin.region !== plugin.region);
        }
        
        this.activePlugins.push(plugin);
        // this.registry.services.ui.runUpdate(UI_Region.Dialog);

        switch(plugin.region) {
            case UI_Region.Dialog:
                this.registry.services.render.runImmediately(RenderTask.RenderDialog);
            break;
        }

    }

    deactivatePlugin(pluginId: string) {
        const plugin = this.findPlugin(pluginId);
        this.activePlugins = this.activePlugins.filter(plugin => plugin.id)

        this.registry.services.ui.runUpdate(UI_Region.Dialog);
    }

    registerPlugin(plugin: UI_Plugin) {
        this.plugins.push(plugin);

        if (plugin.region === UI_Region.SidepanelWidget) {
            (<AbstractSidepanelPlugin> plugin).isGlobalPlugin && this.activatePlugin(plugin.id);
        }
    }
}