import { NodeEditorSettingsPluginFactory } from '../plugins/canvas_plugins/node_editor/NodeEditorSettingsPluginFactory';
import { ObjectSettingsPluginFactory } from '../plugins/canvas_plugins/scene_editor/controllers/ObjectSettingsPluginFactory';
import { AssetManagerPluginFactory } from '../plugins/dialog_plugins/asset_manager/AssetManagerPluginFactory';
import { SpriteSheetManagerFactory } from '../plugins/dialog_plugins/spritesheet_manager/SpriteSheetManagerFactory';
import { AssetManagerSidepanelPluginFactory } from '../plugins/sidepanel_plugins/asset_manager/AssetManagerSidepanelPluginFactory';
import { FileSettingslPluginFactory } from '../plugins/sidepanel_plugins/file_settings/FileSettingsPluginFactory';
import { LayoutSettingsPluginFactory } from '../plugins/sidepanel_plugins/layout_settings/LayoutSettingsPluginFactory';
import { Registry } from './Registry';
import { ObjLifeCycleHook } from './stores/ObjStore';
import { AxisControlHook, ViewLifeCycleHook } from './stores/ViewStore';
import { ThumbnailDialogPlugin } from '../plugins/canvas_plugins/scene_editor/ThumbnailDialogPlugin';
import { KeyboardNode } from '../plugins/canvas_plugins/node_editor/nodes/KeyboardNodeObj';
import { AnimationNode } from '../plugins/canvas_plugins/node_editor/nodes/AnimationNodeObj';
import { MeshNode } from '../plugins/canvas_plugins/node_editor/nodes/MeshNodeObj';
import { MoveNode } from '../plugins/canvas_plugins/node_editor/nodes/MoveNodeObj';
import { PathNode } from '../plugins/canvas_plugins/node_editor/nodes/PathNodeObj';
import { RouteNode } from '../plugins/canvas_plugins/node_editor/nodes/route_node/RouteNodeObj';
import { registerSceneEditor } from '../plugins/canvas_plugins/scene_editor/registerSceneEditor';
import { registerNodeEditor } from '../plugins/canvas_plugins/node_editor/registerNodeEditor';
import { registerGameViewer } from '../plugins/canvas_plugins/game_viewer/registerGameViewer';

export class Editor {
    registry: Registry;
    
    svgCanvasId: string;
    renderFunc: () => void;
    isLoading = true;

    constructor() {
        this.svgCanvasId = 'svg-editor';
        this.registry = new Registry();

        // hooks
        this.registry.stores.objStore.addHook(new ObjLifeCycleHook(this.registry));
        this.registry.stores.views.addHook(new ViewLifeCycleHook(this.registry));
        this.registry.stores.views.addHook(new AxisControlHook(this.registry));

        // plugins
        this.registry.plugins.registerPlugin(new AssetManagerPluginFactory());
        this.registry.plugins.registerPlugin(new NodeEditorSettingsPluginFactory());
        this.registry.plugins.registerPlugin(new ObjectSettingsPluginFactory());
        this.registry.plugins.registerPlugin(new SpriteSheetManagerFactory());
        // this.registry.plugins.registerPlugin(new LevelSettingsPluginFactory());
        this.registry.plugins.registerPlugin(new AssetManagerSidepanelPluginFactory());
        this.registry.plugins.registerPlugin(new FileSettingslPluginFactory());
        // this.registry.plugins.registerPlugin(new CodeEditorPluginFactory());
        this.registry.plugins.registerPlugin(new LayoutSettingsPluginFactory());


        registerSceneEditor(this.registry);
        registerNodeEditor(this.registry);
        registerGameViewer(this.registry);
        this.registry.plugins.registerPlugin2(new ThumbnailDialogPlugin(this.registry));
    
        // nodes
        this.registry.data.helper.node.registerNode(new KeyboardNode(this.registry));
        this.registry.data.helper.node.registerNode(new AnimationNode(this.registry));
        this.registry.data.helper.node.registerNode(new MeshNode(this.registry));
        this.registry.data.helper.node.registerNode(new MoveNode(this.registry));
        this.registry.data.helper.node.registerNode(new PathNode(this.registry));
        this.registry.data.helper.node.registerNode(new RouteNode(this.registry));
    }

    setup(canvas: HTMLCanvasElement) {
        this.registry.services.render.reRenderAll();
        setTimeout(() => {
            this.registry.services.localStore.loadLevelIndexes()
                .then((indexes: number[]) => {
                    if (indexes.length) {
                        this.registry.stores.levelStore.setLevels(indexes);
                        return this.registry.services.level.changeLevel(indexes[0]);
                    }
                })
                .then(() => {
                    this.isLoading = false;
                    this.registry.services.history.createSnapshot();
                    this.render();
                })
    
                .catch(() => {
                    this.isLoading = false;
                    this.render();
                });
        }, 100);       
    }

    render() {
        this.renderFunc && this.renderFunc();
    }

    setRenderer(renderFunc: () => void) {
        this.renderFunc = renderFunc;
    }
}