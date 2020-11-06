import * as axisGizmoPlugin from '../../plugins/canvas/gizmos/axis_gizmo/axisGizmoPlugin';
import * as screenCastKeysGizmoPlugin from '../../plugins/canvas/gizmos/screencast_keys_gizmo/screenCastKeysGizmoPlugin';
import { EngineHooks } from '../engine/hooks/EngineHooks';
import { Registry } from '../Registry';
import { AbstractCanvasPanel } from './AbstractCanvasPanel';
import { FormController } from './controller/FormController';
import { ToolController } from './controller/ToolController';
import { UI_Panel, UI_Region } from './UI_Panel';
import { UI_PluginFactory } from './UI_PluginFactory';

export class Plugins {
    engineHooks: EngineHooks;

    private activePanels: UI_Panel[] = [];

    private pluginFactories: Map<string, UI_PluginFactory> = new Map();
    private panels: Map<string, UI_Panel> = new Map();

    visibilityDirty = true;

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;

        axisGizmoPlugin.register(this);
        screenCastKeysGizmoPlugin.register(this);

        this.engineHooks = new EngineHooks();
    }

    private hoveredView: AbstractCanvasPanel;
    
    setHoveredPlugin(view: AbstractCanvasPanel) {
        this.hoveredView = view;
    }

    removeHoveredPlugin(view: AbstractCanvasPanel) {
        if (this.hoveredView === view) {
            this.hoveredView = undefined;
        }
    }

    getHoveredPlugin(): AbstractCanvasPanel {
        return this.hoveredView;
    }

    getActivePlugins(region?: UI_Region): UI_Panel[] {
        if (region) {
            return this.activePanels.filter(activePlugin => activePlugin.region === region);
        }
        return this.activePanels;
    }

    getPanelById(pluginId: string): UI_Panel {
        return this.plugins.has(pluginId) ? this.plugins.get(pluginId).getPanel() : this.panels.get(pluginId);
    } 

    getPlugin(pluginId: string): PanelPlugin {
        return this.plugins.get(pluginId);
    }

    getPluginsByRegion(region: UI_Region): UI_Plugin[] {
        return this.activePlugins.filter(plugin => plugin.region === region);
    }

    getAll(): UI_Panel[] {
        return Array.from(this.panels.values());
    }

    instantiatePlugin(pluginFactoryId: string) {
        const pluginFactory = this.pluginFactories.get(pluginFactoryId);

        const plugin = pluginFactory.createPlugin(this.registry);
        this.panels.set(plugin.id, plugin);

        const propControllers = pluginFactory.createPropControllers(plugin, this.registry);
        if (propControllers.length > 0) {
            this.formControllers.set(plugin.id, new FormController(plugin, this.registry, propControllers));
        }

        const tools = pluginFactory.createTools(plugin, this.registry);

        if (tools.length > 0) {
            this.toolControllers.set(plugin, new ToolController(plugin as AbstractCanvasPanel, this.registry, tools));
        }

        if (pluginFactory.gizmos) {
            pluginFactory.gizmos.forEach(gizmoId => {
                const gizmo = this.canvas.getGizmoFactory(gizmoId).newInstance(plugin as AbstractCanvasPanel, this.registry);
                (plugin as AbstractCanvasPanel).addGizmo(gizmo);
            });
        }
    }

    showPlugin(pluginId: string) {
        const plugin  = this.plugins.get(pluginId);
        const panel = plugin ? plugin.getPanel() : this.getPanelById(pluginId);

        if (UI_Region.isSinglePluginRegion(panel.region)) {
            this.activePanels = this.activePanels.filter(activePlugin => activePlugin.region !== panel.region);
        }
        
        this.activePanels.push(panel);
        plugin && this.activePlugins.push(plugin);
        panel.activated();

        switch(panel.region) {
            case UI_Region.Dialog:
                this.registry.services.render.reRender(UI_Region.Dialog);
            break;
        }
    }

    deactivatePlugin(pluginId: string) {
        this.activePanels = this.activePanels.filter(plugin => plugin.id !== pluginId);
        this.activePlugins = this.activePlugins.filter(plugin => plugin.id !== pluginId);

        this.registry.services.ui.runUpdate(UI_Region.Dialog);
    }
}