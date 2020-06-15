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
import { MeshImporterPlugin } from '../../plugins/mesh_importer/MeshImporterPlugin';
import { MeshImporterPluginComponentFactory } from '../../plugins/mesh_importer/MeshImporterPluginComponentFactory';
import { AbstractPluginComponentFactory } from '../../plugins/common/AbstractPluginComponentFactory';

export interface LayoutConfig {
    activePlugin: AbstractPlugin;
    allowedPlugins: AbstractPlugin[];
}

export class Layout {
    type: LayoutType;
    configs: LayoutConfig[];

    constructor(type: LayoutType, config: LayoutConfig[]) {
        this.configs = config;
        this.type = type;
    }

    sizes() {
        return this.configs.map(() => 100 / this.configs.length);
    }

    minSizes() {
        return this.configs.map(() => 300);
    }

    ids() {
        return this.configs.map(plugin => plugin.activePlugin.getId());
    }
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
    assetImporter: MeshImporterPlugin;

    plugins: AbstractPlugin[] = [];

    singleLayout: Layout;
    doubleLayout: Layout;

    predefinedLayouts: {title: string; activePluginNames: string[]}[];

    private currentLayout: Layout;
    
    private currentPredefinedLayoutTitle: string; 

    private pluginFactoryMap: Map<AbstractPlugin, AbstractPluginComponentFactory<any>> = new Map();
    
    visibilityDirty = true;

    constructor(registry: Registry) {
        this.sceneEditor = new SceneEditorPlugin(registry);
        this.gameView = new GameViewerPlugin(registry);
        this.nodeEditor = new NodeEditorPlugin(registry);
        this.codeEditor = new CodeEditorPlugin(registry);
        this.assetImporter = new MeshImporterPlugin(registry);

        this.addPlugin(this.sceneEditor, new SceneEditorPluginComponentFactory(this.sceneEditor));
        this.addPlugin(this.gameView, new GameViewerPluginComponentFactory(this.gameView));
        this.addPlugin(this.nodeEditor, new NodeEditorPluginComponentFactory(this.nodeEditor));
        this.addPlugin(this.codeEditor, new CodeEditorPluginComponentFactory(this.codeEditor));
        this.addPlugin(this.assetImporter, new MeshImporterPluginComponentFactory(this.codeEditor));

        let allowedSinglePlugins = this.plugins.filter(plugin => plugin.allowedLayouts.has(LayoutType.Single));
        this.singleLayout = new Layout(LayoutType.Single, [{activePlugin: allowedSinglePlugins[0], allowedPlugins: allowedSinglePlugins}]);
        
        let allowedDoubleLayoutPlugins = this.plugins.filter(plugin => plugin.allowedLayouts.has(LayoutType.Double));
        allowedDoubleLayoutPlugins = allowedDoubleLayoutPlugins.filter(plugin => plugin !== this.gameView);
        this.doubleLayout = new Layout(
            LayoutType.Double,
            [
                {activePlugin: allowedDoubleLayoutPlugins[0], allowedPlugins: allowedDoubleLayoutPlugins},
                {activePlugin: this.gameView, allowedPlugins: [this.gameView]}
            ]
        );

        this.predefinedLayouts = [
            {
                title: 'Scene Editor',
                activePluginNames: [this.sceneEditor.getId(), this.gameView.getId()]
            },
            {
                title: 'Node Editor',
                activePluginNames: [this.nodeEditor.getId()]
            },
            {
                title: 'Code Editor',
                activePluginNames: [this.codeEditor.getId(), this.gameView.getId()]
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

    private hoveredView: AbstractPlugin;
    
    setHoveredView(view: AbstractPlugin) {
        this.hoveredView = view;
    }

    getHoveredView(): AbstractPlugin {
        return this.hoveredView;
    }

    getActivePlugins(): AbstractPlugin[] {
        return this.currentLayout.configs.map(config => config.activePlugin);
    }

    selectPredefinedLayout(title: string) {
        const predefinedLayout = this.predefinedLayouts.find(predef => predef.title === title);

        const layout = predefinedLayout.activePluginNames.length === 1 ? this.singleLayout : this.doubleLayout;

        layout.configs.forEach((config, index) => {
            config.activePlugin = this.getViewById(predefinedLayout.activePluginNames[index]);
            config.activePlugin.resize();
        });
        this.currentLayout = layout;
        this.visibilityDirty = true;
        this.currentPredefinedLayoutTitle = title;
    }

    getViewById<T extends AbstractPlugin = AbstractPlugin>(id: string): T {
        return <T> this.plugins.find(view => view.getId() === id);
    }

    setLayout(layoutType: LayoutType, activePluginNames?: string[]) {
        this.currentLayout = layoutType === LayoutType.Single ? this.singleLayout : this.doubleLayout;
        if (activePluginNames) {
            this.currentLayout.configs.forEach((config, index) => {
                config.activePlugin = this.getViewById(activePluginNames[index]);
                config.activePlugin.resize();
            });
        }
        this.visibilityDirty = true;
    }

    getCurrentLayout(): Layout {
        return this.currentLayout;
    }

    getCurrentPredefinedLayoutTitle(): string {
        return this.currentPredefinedLayoutTitle;
    }
}