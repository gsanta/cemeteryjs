import * as axisGizmoPlugin from '../../plugins/canvas/gizmos/axis_gizmo/axisGizmoPlugin';
import * as screenCastKeysGizmoPlugin from '../../plugins/canvas/gizmos/screencast_keys_gizmo/screenCastKeysGizmoPlugin';
import { EngineHooks } from '../engine/hooks/EngineHooks';
import { Registry } from '../Registry';
import { AbstractCanvasPlugin } from './AbstractCanvasPlugin';
import { CanvasPlugins } from './CanvasPlugins';
import { FormController } from './controller/FormController';
import { ToolController } from './controller/ToolController';
import { UI_Plugin, UI_Region } from './UI_Plugin';
import { UI_PluginFactory } from './UI_PluginFactory';

export class Plugins {
    engineHooks: EngineHooks;

    canvas: CanvasPlugins;

    private activePlugins: UI_Plugin[] = [];

    private pluginFactories: Map<string, UI_PluginFactory> = new Map();
    private plugins: Map<string, UI_Plugin> = new Map();

    private formControllers: Map<string, FormController> = new Map();
    private toolControllers: Map<UI_Plugin, ToolController> = new Map();

    visibilityDirty = true;

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;

        this.canvas = new CanvasPlugins();

        axisGizmoPlugin.register(this);
        screenCastKeysGizmoPlugin.register(this);

        this.engineHooks = new EngineHooks();
    }

    private hoveredView: AbstractCanvasPlugin;
    
    setHoveredPlugin(view: AbstractCanvasPlugin) {
        this.hoveredView = view;
    }

    removeHoveredPlugin(view: AbstractCanvasPlugin) {
        if (this.hoveredView === view) {
            this.hoveredView = undefined;
        }
    }

    getHoveredPlugin(): AbstractCanvasPlugin {
        return this.hoveredView;
    }

    getActivePlugins(region?: UI_Region): UI_Plugin[] {
        if (region) {
            return this.activePlugins.filter(activePlugin => activePlugin.region === region);
        }
        return this.activePlugins;
    }

    getByRegion(region: UI_Region): UI_Plugin[] {
        return this.activePlugins.filter(plugin => plugin.region === region);
    }

    getById(pluginId: string): UI_Plugin {
        return this.plugins.get(pluginId);
    } 

    getAll(): UI_Plugin[] {
        return Array.from(this.plugins.values());
    }

    registerPlugin(pluginFactory: UI_PluginFactory) {
        this.pluginFactories.set(pluginFactory.pluginId, pluginFactory);
        this.instantiatePlugin(pluginFactory.pluginId);

        if (pluginFactory.isGlobalPlugin) {
            this.showPlugin(pluginFactory.pluginId);
        }
    }

    instantiatePlugin(pluginFactoryId: string) {
        const pluginFactory = this.pluginFactories.get(pluginFactoryId);

        const plugin = pluginFactory.createPlugin(this.registry);
        this.plugins.set(plugin.id, plugin);

        const propControllers = pluginFactory.createPropControllers(plugin, this.registry);
        if (propControllers.length > 0) {
            this.formControllers.set(plugin.id, new FormController(plugin, this.registry, propControllers));
        }

        const tools = pluginFactory.createTools(plugin, this.registry);

        if (tools.length > 0) {
            this.toolControllers.set(plugin, new ToolController(plugin as AbstractCanvasPlugin, this.registry, tools));
        }

        if (pluginFactory.gizmos) {
            pluginFactory.gizmos.forEach(gizmoId => {
                const gizmo = this.canvas.getGizmoFactory(gizmoId).newInstance(plugin as AbstractCanvasPlugin, this.registry);
                (plugin as AbstractCanvasPlugin).addGizmo(gizmo);
            });
        }
    }

    addPropController(pluginId: string, controller: FormController): void {
        this.formControllers.set(pluginId, controller);
    }

    getPropController(pluginId: string): FormController {
        return this.formControllers.get(pluginId);
    }

    getToolController(pluginId: string): ToolController {
        return this.toolControllers.get(this.plugins.get(pluginId));
    }

    showPlugin(pluginId: string) {        
        const plugin = this.getById(pluginId);
        if (UI_Region.isSinglePluginRegion(plugin.region)) {
            this.activePlugins = this.activePlugins.filter(activePlugin => activePlugin.region !== plugin.region);
        }
        
        this.activePlugins.push(plugin);
        plugin.activated();

        switch(plugin.region) {
            case UI_Region.Dialog:
                this.registry.services.render.reRender(UI_Region.Dialog);
            break;
        }
    }

    deactivatePlugin(pluginId: string) {
        const plugin = this.getById(pluginId);
        this.activePlugins = this.activePlugins.filter(plugin => plugin.id !== pluginId);

        this.registry.services.ui.runUpdate(UI_Region.Dialog);
    }
}