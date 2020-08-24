import { AbstractCanvasPlugin } from '../core/plugins/AbstractCanvasPlugin';
import { AbstractSidepanelPlugin } from '../core/plugins/AbstractSidepanelPlugin';
import { UI_Plugin, UI_Region } from '../core/plugins/UI_Plugin';
import { Registry } from '../core/Registry';
import { AssetManagerDialogPlugin } from './ui_plugins/dialogs/AssetManagerDialogPlugin';
import { AssetManagerSidepanelPlugin } from './ui_plugins/sidepanel/AssetManagerSidepanelPlugin';
import { CodeEditorPlugin } from './ui_plugins/code_editor/CodeEditorPlugin';
import { AbstractPluginComponentFactory } from './common/AbstractPluginComponentFactory';
import { FileSettingsPlugin } from './ui_plugins/sidepanel/FileSettingsPlugin';
import { GameViewerPlugin } from './ui_plugins/game_viewer/GameViewerPlugin';
import { LayoutSettingsPlugin } from './ui_plugins/sidepanel/LayoutSettingsPlugin';
import { NodeEditorPlugin } from './ui_plugins/node_editor/NodeEditorPlugin';
import { NodeEditorSettingsPlugin } from './ui_plugins/node_editor/NodeEditorSettingsPlugin';
import { ObjectSettingsPlugin } from './ui_plugins/scene_editor/ObjectSettingsPlugin';
import { ThumbnailDialogPlugin } from './ui_plugins/scene_editor/ThumbnailDialogPlugin';
import { SceneEditorPlugin } from './ui_plugins/scene_editor/SceneEditorPlugin';
import { LevelSettingsPlugin } from './ui_plugins/sidepanel/LevelSettingsPlugin';

export class Plugins {
    // private plugins: Map<string, UI_Plugin> = new Map();

    // private registeredPlugins: Map<UI_Region, UI_Plugin[]> = new Map();
    // private showedPlugins: Map<UI_Region, UI_Plugin[]> = new Map();

    sceneEditor: SceneEditorPlugin;
    gameView: GameViewerPlugin;
    nodeEditor: NodeEditorPlugin;
    codeEditor: CodeEditorPlugin;

    private plugins: UI_Plugin[] = [];
    private canvasPlugins: AbstractCanvasPlugin[] = [];
    private activePlugins: UI_Plugin[] = [];

    private pluginFactoryMap: Map<AbstractCanvasPlugin, AbstractPluginComponentFactory<any>> = new Map();
    
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
        this.registerPlugin(new NodeEditorSettingsPlugin(this.registry));
    }

    getPluginFactory(plugin: AbstractCanvasPlugin): AbstractPluginComponentFactory<any> {
        return this.pluginFactoryMap.get(plugin);
    }

    private hoveredView: AbstractCanvasPlugin;
    
    setHoveredView(view: AbstractCanvasPlugin) {
        this.hoveredView = view;
    }

    getHoveredView(): AbstractCanvasPlugin {
        return this.hoveredView;
    }

    getViewById<T extends AbstractCanvasPlugin = AbstractCanvasPlugin>(id: string): T {
        return <T> this.plugins.find(view => view.id === id);
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
        return this.plugins.find(plugin => plugin.id === pluginId);
    } 

    getAll(): UI_Plugin[] {
        return this.plugins;
    }

    registerPlugin(plugin: UI_Plugin) {
        this.plugins.push(plugin);

        if (plugin.region === UI_Region.Sidepanel) {
            (<AbstractSidepanelPlugin> plugin).isGlobalPlugin && this.activatePlugin(plugin.id);
        }
    }

    activatePlugin(pluginId: string) {
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

    deactivatePlugin(pluginId: string) {
        const plugin = this.getById(pluginId);
        this.activePlugins = this.activePlugins.filter(plugin => plugin.id !== pluginId);

        this.registry.services.ui.runUpdate(UI_Region.Dialog);
    }
}