import { AbstractCanvasPlugin } from './AbstractCanvasPlugin';
import { AbstractSidepanelPlugin } from './AbstractSidepanelPlugin';
import { UI_Plugin, UI_Region } from './UI_Plugin';
import { Registry } from '../Registry';
import { CodeEditorPlugin } from '../../plugins/canvas_plugins/code_editor/CodeEditorPlugin';
import { AssetManagerDialogPlugin } from '../../plugins/dialog_plugins/asset_manager/AssetManagerDialogPlugin';
import { GameViewerPlugin } from '../../plugins/canvas_plugins/game_viewer/GameViewerPlugin';
import { NodeEditorPlugin } from '../../plugins/canvas_plugins/node_editor/NodeEditorPlugin';
import { NodeEditorSettingsPlugin } from '../../plugins/canvas_plugins/node_editor/NodeEditorSettingsPlugin';
import { ObjectSettingsPlugin } from '../../plugins/canvas_plugins/scene_editor/controllers/ObjectSettingsPlugin';
import { SceneEditorPlugin } from '../../plugins/canvas_plugins/scene_editor/SceneEditorPlugin';
import { ThumbnailDialogPlugin } from '../../plugins/canvas_plugins/scene_editor/ThumbnailDialogPlugin';
import { AssetManagerSidepanelPlugin } from '../../plugins/sidepanel_plugins/asset_manager/AssetManagerSidepanelPlugin';
import { FileSettingsPlugin } from '../../plugins/sidepanel_plugins/file_settings/FileSettingsPlugin';
import { LayoutSettingsPlugin } from '../../plugins/sidepanel_plugins/layout_settings/LayoutSettingsPlugin';
import { LevelSettingsPlugin } from '../../plugins/sidepanel_plugins/level_settings/LevelSettingsPlugin';
import { SpriteSheetManagerDialogPlugin } from '../../plugins/dialog_plugins/spritesheet_manager/SpritesheetManagerDialogPlugin';
import { PluginFactory } from './PluginFactory';
import { AssetManagerPluginFactory } from '../../plugins/dialog_plugins/asset_manager/AssetManagerPluginFactory';
import { FormController } from './controller/FormController';

export class Plugins {
    sceneEditor: SceneEditorPlugin;
    gameView: GameViewerPlugin;
    nodeEditor: NodeEditorPlugin;
    codeEditor: CodeEditorPlugin;

    private legacyPlugins: UI_Plugin[] = [];
    private activePlugins: UI_Plugin[] = [];

    private pluginFactories: Map<string, PluginFactory> = new Map();
    private plugins: Map<string, UI_Plugin> = new Map();
    private controllers: Map<UI_Plugin, Map<string, FormController>> = new Map();

    visibilityDirty = true;

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
        this.sceneEditor = new SceneEditorPlugin(registry);
        this.gameView = new GameViewerPlugin(registry);
        this.nodeEditor = new NodeEditorPlugin(registry);
        this.codeEditor = new CodeEditorPlugin(registry);

        this.registerPlugin(this.sceneEditor);
        this.registerPlugin(this.gameView);
        this.registerPlugin(this.nodeEditor);
        this.registerPlugin(this.codeEditor);

        this.registerPlugin(new FileSettingsPlugin(this.registry));
        this.registerPlugin(new LayoutSettingsPlugin(this.registry));
        this.registerPlugin(new AssetManagerSidepanelPlugin(this.registry));

        this.registerPlugin(new ObjectSettingsPlugin(this.registry));
        this.registerPlugin(new LevelSettingsPlugin(this.registry));
        this.registerPlugin(new AssetManagerDialogPlugin(this.registry));
        this.registerPlugin(new ThumbnailDialogPlugin(this.registry));
        this.registerPlugin(new SpriteSheetManagerDialogPlugin(this.registry));
        this.registerPlugin(new NodeEditorSettingsPlugin(this.registry));

        this.registerPluginNew(new AssetManagerPluginFactory());
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

    getViewById<T extends AbstractCanvasPlugin = AbstractCanvasPlugin>(id: string): T {
        return <T> this.legacyPlugins.find(view => view.id === id);
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
        return this.legacyPlugins.find(plugin => plugin.id === pluginId);
    } 

    getAll(): UI_Plugin[] {
        return this.legacyPlugins;
    }

    registerPlugin(plugin: UI_Plugin) {
        this.legacyPlugins.push(plugin);

        if (plugin.region === UI_Region.Sidepanel) {
            (<AbstractSidepanelPlugin> plugin).isGlobalPlugin && this.showPlugin(plugin.id);
        }
    }

    // TODO replace this with `registerPlugin` if that method is not used anymore
    registerPluginNew(pluginFactory: PluginFactory) {
        this.pluginFactories.set(pluginFactory.pluginId, pluginFactory);
    }

    getController(pluginId: string, controllerId: string): FormController {
        return this.controllers.get(this.plugins.get(pluginId))?.get(controllerId);
    }

    showPlugin(pluginId: string) {
        
        //TODO: this is the relevant code, when all of the plugins will use PluginFactory
        if (this.pluginFactories.has(pluginId)) {
            if (!this.plugins.has(pluginId)) {
                const plugin = this.pluginFactories.get(pluginId).createPlugin(this.registry);
                this.plugins.set(pluginId, plugin);
                this.controllers.set(plugin, new Map());

                const pluginControllers = this.pluginFactories.get(pluginId).createControllers(plugin, this.registry);
                pluginControllers.forEach(controller => this.controllers.get(plugin).set(controller.id, controller)); 

                this.activePlugins.push(plugin);
                plugin.activated();

                switch(plugin.region) {
                    case UI_Region.Dialog:
                        this.registry.services.render.reRender(UI_Region.Dialog);
                    break;
                }    
            }
        // TODO_END
        } else {

            const plugin = this.getById(pluginId);
            if (UI_Region.isSinglePluginRegion(plugin.region)) {
                this.activePlugins = this.activePlugins.filter(activePlugin => activePlugin.region !== plugin.region);
            }
            
            this.activePlugins.push(plugin);
            plugin.activated();
            // this.registry.services.ui.runUpdate(UI_Region.Dialog);
            switch(plugin.region) {
                case UI_Region.Dialog:
                    this.registry.services.render.reRender(UI_Region.Dialog);
                break;
            }
        }
    }

    deactivatePlugin(pluginId: string) {
        const plugin = this.getById(pluginId);
        this.activePlugins = this.activePlugins.filter(plugin => plugin.id !== pluginId);

        this.registry.services.ui.runUpdate(UI_Region.Dialog);
    }
}