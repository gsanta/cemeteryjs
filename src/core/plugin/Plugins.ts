import * as axisGizmoPlugin from '../../plugins/canvas/gizmos/axis_gizmo/axisGizmoPlugin';
import * as screenCastKeysGizmoPlugin from '../../plugins/canvas/gizmos/screencast_keys_gizmo/screenCastKeysGizmoPlugin';
import { EngineHooks } from '../engine/hooks/EngineHooks';
import { Registry } from '../Registry';
import { AbstractCanvasPanel } from './AbstractCanvasPanel';
import { CanvasLookup } from './CanvasPlugins';
import { FormController } from './controller/FormController';
import { ToolController } from './controller/ToolController';
import { UI_Panel, UI_Region } from './UI_Panel';
import { UI_PluginFactory, UI_Renderer } from './UI_PluginFactory';
import { UI_Container } from '../ui_components/elements/UI_Container';
import { PanelPlugin, UI_Plugin } from './UI_Plugin';
import { NodePlugin } from '../services/NodePlugin';

export class Plugins {
    engineHooks: EngineHooks;

    canvas: CanvasLookup;
    node: NodePlugin;

    private activePanels: UI_Panel[] = [];
    private activePlugins: UI_Plugin[] = [];

    private pluginFactories: Map<string, UI_PluginFactory> = new Map();
    private renderers: Map<string, UI_Renderer> = new Map();
    private panels: Map<string, UI_Panel> = new Map();

    private plugins: Map<string, UI_Plugin> = new Map();

    private formControllers: Map<string, FormController> = new Map();
    private toolControllers: Map<UI_Panel, ToolController> = new Map();

    visibilityDirty = true;

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;

        this.canvas = new CanvasLookup();

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

    getPanelByRegion(region: UI_Region): PanelPlugin[] {
        return this.activePanels.filter(plugin => plugin.region === region);
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

    registerPlugin2(plugin: UI_Plugin) {
        this.plugins.set(plugin.id, plugin);
        this.panels.set(plugin.id, plugin.getPanel());
    }

    registerPlugin(pluginFactory: UI_PluginFactory) {
        this.pluginFactories.set(pluginFactory.pluginId, pluginFactory);
        this.instantiatePlugin(pluginFactory.pluginId);

        if (pluginFactory.createRenderer) {
            this.renderers.set(pluginFactory.pluginId, pluginFactory.createRenderer(this.registry));
        }

        if (pluginFactory.isGlobalPlugin) {
            this.showPlugin(pluginFactory.pluginId);
        }
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

    addPropController(pluginId: string, controller: FormController): void {
        this.formControllers.set(pluginId, controller);
    }

    getPropController(pluginId: string): FormController {
        return this.formControllers.get(pluginId);
    }

    renderInto(element: UI_Container, pluginId: string) {
        if (this.renderers.get(pluginId)) {
            this.renderers.get(pluginId).renderInto(element, this.getPanelById(pluginId));
        } else {
            this.getPanelById(pluginId).renderInto(element);
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