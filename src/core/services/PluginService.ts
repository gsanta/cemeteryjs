import { AbstractPlugin } from '../AbstractPlugin';
import { Registry } from '../Registry';
import { SceneEditorPlugin } from '../../plugins/scene_editor/SceneEditorPlugin';
import { GameViewerPlugin } from '../../plugins/game_viewer/GameViewerPlugin';
import { NodeEditorPlugin } from '../../plugins/node_editor/NodeEditorPlugin';
import { CodeEditorPlugin } from '../../plugins/code_editor/CodeEditorPlugin';

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
    Double = 'Double'
}

export class PluginService {
    sceneEditor: SceneEditorPlugin;
    gameView: GameViewerPlugin;
    nodeEditor: NodeEditorPlugin;
    codeEditor: CodeEditorPlugin;

    plugins: AbstractPlugin[];

    singleLayout: Layout;
    doubleLayout: Layout;

    predefinedLayouts: {title: string; activePluginNames: string[]}[];

    private currentLayout: Layout;
    
    private currentPredefinedLayoutTitle: string; 

    visibilityDirty = true;

    constructor(registry: Registry) {
        this.sceneEditor = new SceneEditorPlugin(registry);
        this.gameView = new GameViewerPlugin(registry);
        this.nodeEditor = new NodeEditorPlugin(registry);
        this.codeEditor = new CodeEditorPlugin(registry);

        this.plugins = [
            this.sceneEditor,
            this.gameView,
            this.nodeEditor,
            this.codeEditor
        ];

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

    private hoveredView: AbstractPlugin;
    
    setHoveredView(view: AbstractPlugin) {
        this.hoveredView = view;
    }

    getHoveredView(): AbstractPlugin {
        return this.hoveredView;
    }

    selectPredefinedLayout(title: string) {
        const predefinedLayout = this.predefinedLayouts.find(predef => predef.title === title);

        const layout = predefinedLayout.activePluginNames.length === 1 ? this.singleLayout : this.doubleLayout;

        layout.configs.forEach((config, index) => config.activePlugin = this.getViewById(predefinedLayout.activePluginNames[index]));
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
            this.currentLayout.configs.forEach((config, index) => config.activePlugin = this.getViewById(activePluginNames[index]));
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