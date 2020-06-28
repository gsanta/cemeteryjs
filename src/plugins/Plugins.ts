import { AbstractPlugin } from '../core/AbstractPlugin';
import { Registry } from '../core/Registry';
import { SceneEditorPlugin } from './scene_editor/SceneEditorPlugin';
import { SceneEditorPluginComponentFactory } from './scene_editor/SceneEditorPluginComponentFactory';
import { GameViewerPlugin } from './game_viewer/GameViewerPlugin';
import { GameViewerPluginComponentFactory } from './game_viewer/GameViewerPluginComponentFactory';
import { NodeEditorPlugin } from './node_editor/NodeEditorPlugin';
import { NodeEditorPluginComponentFactory } from './node_editor/NodeEditorPluginComponentFactory';
import { CodeEditorPlugin } from './code_editor/CodeEditorPlugin';
import { CodeEditorPluginComponentFactory } from './code_editor/CodeEditorPluginComponentFactory';
import { AssetLoaderPlugin } from './asset_loader/AssetLoaderPlugin';
import { AssetLoaderPluginComponentFactory } from './asset_loader/AssetLoaderPluginComponentFactory';
import { AbstractPluginComponentFactory } from './common/AbstractPluginComponentFactory';

export interface LayoutConfig {
    activePlugin: AbstractPlugin;
    allowedPlugins: AbstractPlugin[];
}

export enum LayoutType {
    Single = 'Single',
    Double = 'Double',
    Dialog = 'Dialog'
}

export class Plugins {
    sceneEditor: SceneEditorPlugin;
    gameView: GameViewerPlugin;
    nodeEditor: NodeEditorPlugin;
    codeEditor: CodeEditorPlugin;
    assetImporter: AssetLoaderPlugin;
    plugins: AbstractPlugin[] = [];
    activePlugins: AbstractPlugin[] = [];

    predefinedLayouts: {title: string; plugins: AbstractPlugin[]}[];
    private currentPredefinedLayout: {title: string; plugins: AbstractPlugin[]}; 
    private pluginFactoryMap: Map<AbstractPlugin, AbstractPluginComponentFactory<any>> = new Map();
    
    visibilityDirty = true;

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
        this.sceneEditor = new SceneEditorPlugin(registry);
        this.gameView = new GameViewerPlugin(registry);
        this.nodeEditor = new NodeEditorPlugin(registry);
        this.codeEditor = new CodeEditorPlugin(registry);
        this.assetImporter = new AssetLoaderPlugin(registry);

        this.registerPlugin(this.sceneEditor, new SceneEditorPluginComponentFactory(registry, this.sceneEditor));
        this.registerPlugin(this.gameView, new GameViewerPluginComponentFactory(registry, this.gameView));
        this.registerPlugin(this.nodeEditor, new NodeEditorPluginComponentFactory(registry, this.nodeEditor));
        this.registerPlugin(this.codeEditor, new CodeEditorPluginComponentFactory(registry, this.codeEditor));
        this.registerPlugin(this.assetImporter, new AssetLoaderPluginComponentFactory(registry, this.assetImporter));

        this.predefinedLayouts = [
            {
                title: 'Scene Editor',
                plugins: [this.sceneEditor, this.gameView]
            },
            {
                title: 'Node Editor',
                plugins: [this.nodeEditor]
            },
            {
                title: 'Code Editor',
                plugins: [this.codeEditor, this.gameView]
            }
        ];

        this.selectPredefinedLayout('Scene Editor');
    }

    registerPlugin(plugin: AbstractPlugin, componentFactory: AbstractPluginComponentFactory<AbstractPlugin>) {
        this.plugins.push(plugin);
        this.pluginFactoryMap.set(plugin, componentFactory);

        if (plugin.pluginSettings.dialogController) {
            this.registry.services.dialog.dialogs.push(plugin.pluginSettings.dialogController);
        }
    }

    getPluginFactory(plugin: AbstractPlugin): AbstractPluginComponentFactory<any> {
        return this.pluginFactoryMap.get(plugin);
    }

    private hoveredView: AbstractPlugin;
    
    setHoveredView(view: AbstractPlugin) {
        this.hoveredView = view;
    }

    getHoveredView(): AbstractPlugin {
        return this.hoveredView;
    }

    getActivePlugins(): AbstractPlugin[] {
        return this.activePlugins;
    }

    selectPredefinedLayout(title: string) {
        const predefinedLayout = this.predefinedLayouts.find(predef => predef.title === title);
        this.currentPredefinedLayout = predefinedLayout;

        const activePlugins = predefinedLayout.plugins;
        this.setActivePlugins(activePlugins);
    }

    setActivePlugins(activePlugins: AbstractPlugin[]) {
        const prevActivePLugins = [...this.activePlugins];
        this.visibilityDirty = true;

        this.activePlugins = activePlugins;
        
        const destroyPlugins = prevActivePLugins.filter(plugin => this.activePlugins.indexOf(plugin) === -1);
        destroyPlugins.forEach(plugin => plugin.destroy());

        this.activePlugins.forEach(plugin => plugin.resize());
    }

    getViewById<T extends AbstractPlugin = AbstractPlugin>(id: string): T {
        return <T> this.plugins.find(view => view.getId() === id);
    }

    getCurrentPredefinedLayout(): {title: string; plugins: AbstractPlugin[]} {
        return this.currentPredefinedLayout;
    }
}