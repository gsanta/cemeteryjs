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
import { AbstractSidepanelPlugin } from './AbstractSidepanelPlugin';
import { FormController } from './controller/FormController';
import { ToolController } from './controller/ToolController';
import { PluginFactory } from './PluginFactory';
import { UI_Plugin, UI_Region } from './UI_Plugin';

export class Plugins {
    private activePlugins: UI_Plugin[] = [];

    private pluginFactories: Map<string, PluginFactory> = new Map();
    private plugins: Map<string, UI_Plugin> = new Map();
    private controllers: Map<UI_Plugin, FormController> = new Map();
    private toolControllers: Map<UI_Plugin, ToolController> = new Map();

    visibilityDirty = true;

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;

        this.registerPluginNew(new SceneEditorPluginFactory());
        this.registerPluginNew(new AssetManagerPluginFactory());
        this.registerPluginNew(new GameViewerPluginFactory());
        this.registerPluginNew(new NodeEditorPluginFactory());
        this.registerPluginNew(new NodeEditorSettingsPluginFactory());
        this.registerPluginNew(new ThumbnailDialogPluginFactory());
        this.registerPluginNew(new ObjectSettingsPluginFactory());
        this.registerPluginNew(new SpriteSheetManagerFactory());
        this.registerPluginNew(new LevelSettingsPluginFactory());
        this.registerPluginNew(new AssetManagerSidepanelPluginFactory());
        this.registerPluginNew(new LayoutSettingsPluginFactory());
        this.registerPluginNew(new FileSettingslPluginFactory());
        this.registerPluginNew(new CodeEditorPluginFactory());
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
    registerPluginNew(pluginFactory: PluginFactory) {
        this.pluginFactories.set(pluginFactory.pluginId, pluginFactory);
    }

    getPropController(pluginId: string): FormController {
        return this.controllers.get(this.plugins.get(pluginId));
    }

    getToolController(pluginId: string): ToolController {
        return this.toolControllers.get(this.plugins.get(pluginId));
    }

    showPlugin(pluginId: string) {        
        if (this.pluginFactories.has(pluginId)) {
            if (!this.plugins.has(pluginId)) {
                const pluginFactory = this.pluginFactories.get(pluginId);
                const plugin = pluginFactory.createPlugin(this.registry);
                this.plugins.set(pluginId, plugin);

                const propControllers = pluginFactory.createPropControllers(plugin, this.registry);
                if (propControllers.length > 0) {
                    this.controllers.set(plugin, new FormController(plugin, this.registry, propControllers));
                }

                const tools = pluginFactory.createTools(plugin, this.registry);

                if (tools.length > 0) {
                    this.toolControllers.set(plugin, new ToolController(plugin as AbstractCanvasPlugin, this.registry, tools));
                }   
            }
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