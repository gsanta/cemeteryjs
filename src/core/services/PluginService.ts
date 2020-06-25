import { AbstractPlugin } from '../AbstractPlugin';
import { Registry } from '../Registry';
import { SceneEditorPlugin } from '../../plugins/scene_editor/SceneEditorPlugin';
import { SceneEditorPluginComponentFactory } from '../../plugins/scene_editor/SceneEditorPluginComponentFactory';
import { GameViewerPlugin } from '../../plugins/game_viewer/GameViewerPlugin';
import { GameViewerPluginComponentFactory } from '../../plugins/game_viewer/GameViewerPluginComponentFactory';
import { NodeEditorPlugin } from '../../plugins/node_editor/NodeEditorPlugin';
import { NodeEditorPluginComponentFactory } from '../../plugins/node_editor/NodeEditorPluginComponentFactory';
import { CodeEditorPlugin } from '../../plugins/code_editor/CodeEditorPlugin';
import { CodeEditorPluginComponentFactory } from '../../plugins/code_editor/CodeEditorPluginComponentFactory';
import { AssetLoaderPlugin } from '../../plugins/asset_loader/AssetLoaderPlugin';
import { AssetLoaderPluginComponentFactory } from '../../plugins/asset_loader/AssetLoaderPluginComponentFactory';
import { AbstractPluginComponentFactory } from '../../plugins/common/AbstractPluginComponentFactory';

export interface LayoutConfig {
    activePlugin: AbstractPlugin;
    allowedPlugins: AbstractPlugin[];
}

export enum LayoutType {
    Single = 'Single',
    Double = 'Double',
    Dialog = 'Dialog'
}

export class PluginService {
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

    constructor(registry: Registry) {
        this.sceneEditor = new SceneEditorPlugin(registry);
        this.gameView = new GameViewerPlugin(registry);
        this.nodeEditor = new NodeEditorPlugin(registry);
        this.codeEditor = new CodeEditorPlugin(registry);
        this.assetImporter = new AssetLoaderPlugin(registry);

        this.addPlugin(this.sceneEditor, new SceneEditorPluginComponentFactory(registry, this.sceneEditor));
        this.addPlugin(this.gameView, new GameViewerPluginComponentFactory(registry, this.gameView));
        this.addPlugin(this.nodeEditor, new NodeEditorPluginComponentFactory(registry, this.nodeEditor));
        this.addPlugin(this.codeEditor, new CodeEditorPluginComponentFactory(registry, this.codeEditor));
        this.addPlugin(this.assetImporter, new AssetLoaderPluginComponentFactory(registry, this.assetImporter));

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

    addPlugin(plugin: AbstractPlugin, componentFactory: AbstractPluginComponentFactory<AbstractPlugin>) {
        this.plugins.push(plugin);
        this.pluginFactoryMap.set(plugin, componentFactory);
    }

    getPluginFactory(plugin: AbstractPlugin): AbstractPluginComponentFactory<any> {
        return this.pluginFactoryMap.get(plugin);
    }

    private hoveredView: AbstractPlugin;registry
    
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