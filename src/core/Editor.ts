import { registerGameViewer } from '../plugins/canvas_plugins/game_viewer/registerGameViewer';
import { AnimationNode } from '../plugins/canvas_plugins/node_editor/nodes/AnimationNode';
import { KeyboardNode } from '../plugins/canvas_plugins/node_editor/nodes/KeyboardNode';
import { MeshNode } from '../plugins/canvas_plugins/node_editor/nodes/MeshNode';
import { MeshPropertyNode } from '../plugins/canvas_plugins/node_editor/nodes/MeshPropertyNode';
import { MeshVisibilityNode } from '../plugins/canvas_plugins/node_editor/nodes/MeshVisibilityNode';
import { MoveNode } from '../plugins/canvas_plugins/node_editor/nodes/MoveNode';
import { PathNode } from '../plugins/canvas_plugins/node_editor/nodes/PathNode';
import { RayCasterNode } from '../plugins/canvas_plugins/node_editor/nodes/RayCasterNode';
import { RayHelperNode } from '../plugins/canvas_plugins/node_editor/nodes/RayHelperNode';
import { RemoveMeshNode } from '../plugins/canvas_plugins/node_editor/nodes/RemoveMeshNode';
import { RotateNode } from '../plugins/canvas_plugins/node_editor/nodes/RotateNode';
import { RouteNode } from '../plugins/canvas_plugins/node_editor/nodes/route_node/RouteNode';
import { TriggerZoneNode } from '../plugins/canvas_plugins/node_editor/nodes/TriggerZoneNode';
import { registerNodeEditor } from '../plugins/canvas_plugins/node_editor/registerNodeEditor';
import { registerNodeListPanel } from '../plugins/canvas_plugins/node_editor/registerNodeListPanel';
import { registerObjectSettingsPanel } from '../plugins/canvas_plugins/scene_editor/registerObjectSettingsPanel';
import { registerSceneEditor } from '../plugins/canvas_plugins/scene_editor/registerSceneEditor';
import { registerSpriteSheetManagerDialog } from '../plugins/dialog_plugins/spritesheet_manager/registerSpriteSheetManagerDialog';
import { registerThumbnailCanvas } from '../plugins/dialog_plugins/thumbnail/registerThumbnailCanvas';
import { registerThumbnaildialog } from '../plugins/dialog_plugins/thumbnail/registerThumbnailDialog';
import { registerAssetManagerPanel } from '../plugins/sidepanel_plugins/asset_manager/registerAssetManagerPanel';
import { registerFileSettingsPanel } from '../plugins/sidepanel_plugins/file_settings/registerFileSettingsPanel';
import { registerLayoutSettingsPanel } from '../plugins/sidepanel_plugins/layout_settings/registerLayoutSettingsPanel';
import { registerLevelSettingsPanel } from '../plugins/sidepanel_plugins/level_settings/registerLevelSettingsPlugin';
import { Registry } from './Registry';
import { NodeGraphHook } from './services/NodePlugin';
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
        this.registry.data.view.scene.addHook(new ViewLifeCycleHook(this.registry));
        this.registry.data.view.node.addHook(new ViewLifeCycleHook(this.registry));
        this.registry.data.view.node.addHook(new NodeGraphHook(this.registry));
        
        this.registry.data.view.scene.addHook(new AxisControlHook(this.registry));

        // side panels
        registerAssetManagerPanel(this.registry);
        registerNodeListPanel(this.registry);
        registerAssetManagerPanel(this.registry);
        registerFileSettingsPanel(this.registry);
        registerLayoutSettingsPanel(this.registry);
        registerObjectSettingsPanel(this.registry);
        registerLevelSettingsPanel(this.registry)

        // dialogs
        registerThumbnaildialog(this.registry);
        registerSpriteSheetManagerDialog(this.registry);

        registerSceneEditor(this.registry);
        registerNodeEditor(this.registry);
        registerGameViewer(this.registry);
        registerThumbnailCanvas(this.registry);
    
        // nodes
        this.registry.data.helper.node.registerNode(new KeyboardNode(this.registry));
        this.registry.data.helper.node.registerNode(new AnimationNode(this.registry));
        this.registry.data.helper.node.registerNode(new MeshNode(this.registry));
        this.registry.data.helper.node.registerNode(new MoveNode(this.registry));
        this.registry.data.helper.node.registerNode(new RotateNode(this.registry));
        this.registry.data.helper.node.registerNode(new PathNode(this.registry));
        this.registry.data.helper.node.registerNode(new RouteNode(this.registry));
        this.registry.data.helper.node.registerNode(new RayCasterNode(this.registry));
        this.registry.data.helper.node.registerNode(new RayHelperNode(this.registry));
        this.registry.data.helper.node.registerNode(new RemoveMeshNode(this.registry));
        this.registry.data.helper.node.registerNode(new MeshPropertyNode(this.registry));
        this.registry.data.helper.node.registerNode(new TriggerZoneNode(this.registry));
        this.registry.data.helper.node.registerNode(new MeshVisibilityNode(this.registry));
    }

    setup() {
        this.registry.services.localStore.setup();
        this.registry.services.render.reRenderAll();
            
        setTimeout(() => {
            this.registry.engine.registerRenderLoop(() => this.registry.services.game.renderLoop())
        }, 0);
        
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