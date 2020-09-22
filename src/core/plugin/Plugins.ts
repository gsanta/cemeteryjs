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

export class Plugins {
    sceneEditor: SceneEditorPlugin;
    gameView: GameViewerPlugin;
    nodeEditor: NodeEditorPlugin;
    codeEditor: CodeEditorPlugin;

    private plugins: UI_Plugin[] = [];
    private activePlugins: UI_Plugin[] = [];
    
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