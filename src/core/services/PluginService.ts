import { UI_Plugin } from '../UI_Plugin';


export class PluginService {
    private idCache: Map<string, UI_Plugin> = new Map();

    registeredDialogs: UI_Plugin[] = [];
    dialog: UI_Plugin;

    registeredSidepanelWidgets: UI_Plugin[] = [];
    sidepanelWidgets: UI_Plugin[] = [];

    registeredCanvas1s: UI_Plugin[] = [];
    canvas1: UI_Plugin;

    registeredCanvas2s: UI_Plugin[] = [];
    canvas2: UI_Plugin;

    find_ui_plugin(pluginId: string): UI_Plugin {
        return this.idCache.get(pluginId);
    }

    register_ui_plugin(plugin: UI_Plugin) {
        this.idCache.set(plugin.id, plugin);
    }
}