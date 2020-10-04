import { CodeEditorPluginFactory } from '../../plugins/canvas_plugins/code_editor/CodeEditorPluginFactory';
import { GameViewerPluginFactory } from '../../plugins/canvas_plugins/game_viewer/GameViewerPluginFactory';
import { NodeEditorPluginFactory } from '../../plugins/canvas_plugins/node_editor/NodeEditorPluginFactory';
import { NodeEditorSettingsPluginFactory } from '../../plugins/canvas_plugins/node_editor/NodeEditorSettingsPluginFactory';
import { ObjectSettingsPluginFactory } from '../../plugins/canvas_plugins/scene_editor/controllers/ObjectSettingsPluginFactory';
import { SceneEditorPluginFactory } from '../../plugins/canvas_plugins/scene_editor/SceneEditorPluginFactory';
import { ThumbnailDialogPluginFactory } from '../../plugins/canvas_plugins/scene_editor/ThumbnailDialogPluginFactory';
import { AssetManagerPluginFactory } from '../../plugins/dialog_plugins/asset_manager/AssetManagerPluginFactory';
import { SpriteSheetManagerFactory } from '../../plugins/dialog_plugins/spritesheet_manager/SpriteSheetManagerFactory';
import { AssetManagerSidepanelPluginFactory } from '../../plugins/sidepanel_plugins/asset_manager/AssetManagerSidepanelPluginFactory';
import { FileSettingslPluginFactory } from '../../plugins/sidepanel_plugins/file_settings/FileSettingsPluginFactory';
import { LayoutSettingsPluginFactory } from '../../plugins/sidepanel_plugins/layout_settings/LayoutSettingsPluginFactory';
import { LevelSettingsPluginFactory } from '../../plugins/sidepanel_plugins/level_settings/LevelSettingsPluginFactory';
import { Registry } from '../Registry';
import { AbstractCanvasPlugin } from './AbstractCanvasPlugin';
import { FormController } from './controller/FormController';
import { ToolController } from './controller/ToolController';
import { UI_PluginFactory } from './UI_PluginFactory';
import { UI_Plugin, UI_Region } from './UI_Plugin';
import { EngineHooks } from '../engine/hooks/EngineHooks';

export class Plugins {
    engineHooks: EngineHooks;

    private activePlugins: UI_Plugin[] = [];

    private pluginFactories: Map<string, UI_PluginFactory> = new Map();
    private plugins: Map<string, UI_Plugin> = new Map();

    private formControllers: Map<string, FormController> = new Map();
    private toolControllers: Map<UI_Plugin, ToolController> = new Map();

    visibilityDirty = true;

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;

        this.registerPlugin(new SceneEditorPluginFactory());
        this.registerPlugin(new AssetManagerPluginFactory());
        this.registerPlugin(new GameViewerPluginFactory());
        this.registerPlugin(new NodeEditorPluginFactory());
        this.registerPlugin(new NodeEditorSettingsPluginFactory());
        this.registerPlugin(new ThumbnailDialogPluginFactory());
        this.registerPlugin(new ObjectSettingsPluginFactory());
        this.registerPlugin(new SpriteSheetManagerFactory());
        this.registerPlugin(new LevelSettingsPluginFactory());
        this.registerPlugin(new AssetManagerSidepanelPluginFactory());
        this.registerPlugin(new FileSettingslPluginFactory());
        this.registerPlugin(new CodeEditorPluginFactory());
        this.registerPlugin(new LayoutSettingsPluginFactory());

        this.engineHooks = new EngineHooks();
    }

    private hoveredView: AbstractCanvasPlugin;
    
    setHoveredView(view: AbstractCanvasPlugin) {
        this.hoveredView = view;
    }

    removeHoveredView(view: AbstractCanvasPlugin) {
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

    // TODO replace this with `registerPlugin` if that method is not used anymore
    registerPlugin(pluginFactory: UI_PluginFactory) {
        this.pluginFactories.set(pluginFactory.pluginId, pluginFactory);
        
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
        if (!this.plugins.has(pluginId)) {
            this.instantiatePlugin(pluginId);
        }

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