import { CodeEditorPluginFactory } from '../plugins/canvas_plugins/code_editor/CodeEditorPluginFactory';
import { GameViewerPluginFactory } from '../plugins/canvas_plugins/game_viewer/GameViewerPluginFactory';
import { NodeEditorPluginFactory } from '../plugins/canvas_plugins/node_editor/NodeEditorPluginFactory';
import { NodeEditorSettingsPluginFactory } from '../plugins/canvas_plugins/node_editor/NodeEditorSettingsPluginFactory';
import { AnimationNodeFacotry } from '../plugins/canvas_plugins/node_editor/nodes/AnimationNodeObj';
import { KeyboardNodeFacotry } from '../plugins/canvas_plugins/node_editor/nodes/KeyboardNodeObj';
import { MeshNodeFacotry } from '../plugins/canvas_plugins/node_editor/nodes/MeshNodeObj';
import { MoveNodeFacotry } from '../plugins/canvas_plugins/node_editor/nodes/MoveNodeObj';
import { PathNodeFacotry } from '../plugins/canvas_plugins/node_editor/nodes/PathNodeObj';
import { RouteNodeFacotry } from '../plugins/canvas_plugins/node_editor/nodes/route_node/RouteNodeObj';
import { ObjectSettingsPluginFactory } from '../plugins/canvas_plugins/scene_editor/controllers/ObjectSettingsPluginFactory';
import { SceneEditorPluginFactory } from '../plugins/canvas_plugins/scene_editor/SceneEditorPluginFactory';
import { ThumbnailDialogPluginFactory } from '../plugins/canvas_plugins/scene_editor/ThumbnailDialogPluginFactory';
import { AssetManagerPluginFactory } from '../plugins/dialog_plugins/asset_manager/AssetManagerPluginFactory';
import { SpriteSheetManagerFactory } from '../plugins/dialog_plugins/spritesheet_manager/SpriteSheetManagerFactory';
import { AssetManagerSidepanelPluginFactory } from '../plugins/sidepanel_plugins/asset_manager/AssetManagerSidepanelPluginFactory';
import { FileSettingslPluginFactory } from '../plugins/sidepanel_plugins/file_settings/FileSettingsPluginFactory';
import { LayoutSettingsPluginFactory } from '../plugins/sidepanel_plugins/layout_settings/LayoutSettingsPluginFactory';
import { LevelSettingsPluginFactory } from '../plugins/sidepanel_plugins/level_settings/LevelSettingsPluginFactory';
import { Registry } from './Registry';
import { ObjLifeCycleHook } from './stores/ObjStore';
import { AxisControlHook, ViewLifeCycleHook } from './stores/ViewStore';

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
        this.registry.plugins.registerPlugin(new SceneEditorPluginFactory());
        this.registry.plugins.registerPlugin(new AssetManagerPluginFactory());
        this.registry.plugins.registerPlugin(new GameViewerPluginFactory());
        this.registry.plugins.registerPlugin(new NodeEditorPluginFactory());
        this.registry.plugins.registerPlugin(new NodeEditorSettingsPluginFactory());
        this.registry.plugins.registerPlugin(new ThumbnailDialogPluginFactory());
        this.registry.plugins.registerPlugin(new ObjectSettingsPluginFactory());
        this.registry.plugins.registerPlugin(new SpriteSheetManagerFactory());
        // this.registry.plugins.registerPlugin(new LevelSettingsPluginFactory());
        this.registry.plugins.registerPlugin(new AssetManagerSidepanelPluginFactory());
        this.registry.plugins.registerPlugin(new FileSettingslPluginFactory());
        this.registry.plugins.registerPlugin(new CodeEditorPluginFactory());
        this.registry.plugins.registerPlugin(new LayoutSettingsPluginFactory());
    
        // nodes
        this.registry.services.node.registerNode(KeyboardNodeFacotry);
        this.registry.services.node.registerNode(AnimationNodeFacotry);
        this.registry.services.node.registerNode(MeshNodeFacotry);
        this.registry.services.node.registerNode(MoveNodeFacotry);
        this.registry.services.node.registerNode(PathNodeFacotry);
        this.registry.services.node.registerNode(RouteNodeFacotry);
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