import { registerGameViewer } from '../plugins/canvas_plugins/game_viewer/registerGameViewer';
import { AnimationGroupNode } from '../plugins/canvas_plugins/node_editor/nodes/animation_group_node/AnimationGroupNode';
import { FilterMeshNode } from '../plugins/canvas_plugins/node_editor/nodes/filter_mesh_node/FilterMeshNode';
import { KeyboardNode } from '../plugins/canvas_plugins/node_editor/nodes/keyboard_node/KeyboardNode';
import { MeshNode } from '../plugins/canvas_plugins/node_editor/nodes/mesh_node/MeshNode';
import { MeshVisibilityNode } from '../plugins/canvas_plugins/node_editor/nodes/mesh_visibility_node/MeshVisibilityNode';
import { MoveNode } from '../plugins/canvas_plugins/node_editor/nodes/move_node/MoveNode';
import { RayCasterNode } from '../plugins/canvas_plugins/node_editor/nodes/ray_caster_node/RayCasterNode';
import { RayHelperNode } from '../plugins/canvas_plugins/node_editor/nodes/ray_helper_node/RayHelperNode';
import { RemoveMeshNode } from '../plugins/canvas_plugins/node_editor/nodes/remove_mesh_node/RemoveMeshNode';
import { RotateNode } from '../plugins/canvas_plugins/node_editor/nodes/rotate_node/RotateNode';
import { TriggerZoneNode } from '../plugins/canvas_plugins/node_editor/nodes/trigger_zone_node/TriggerZoneNode';
import { registerNodeEditor } from '../plugins/canvas_plugins/node_editor/registerNodeEditor';
import { registerNodeListPanel } from '../plugins/canvas_plugins/node_editor/registerNodeListPanel';
import { registerObjectSettingsPanel } from '../plugins/canvas_plugins/scene_editor/registerObjectSettingsPanel';
import { registerSceneEditor } from '../plugins/canvas_plugins/scene_editor/registerSceneEditor';
import { registerMeshLoaderDialog } from '../plugins/dialog_plugins/mesh_loader/registerMeshLoaderDialog';
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
        registerMeshLoaderDialog(this.registry);

        registerSceneEditor(this.registry);
        registerNodeEditor(this.registry);
        registerGameViewer(this.registry);
        registerThumbnailCanvas(this.registry);
    
        // nodes
        this.registry.data.helper.node.registerNode(new KeyboardNode(this.registry));
        // this.registry.data.helper.node.registerNode(new AnimationNode(this.registry));
        this.registry.data.helper.node.registerNode(new MeshNode(this.registry));
        this.registry.data.helper.node.registerNode(new MoveNode(this.registry));
        this.registry.data.helper.node.registerNode(new RotateNode(this.registry));
        // this.registry.data.helper.node.registerNode(new PathNode(this.registry));
        // this.registry.data.helper.node.registerNode(new RouteNode(this.registry));
        this.registry.data.helper.node.registerNode(new RayCasterNode(this.registry));
        this.registry.data.helper.node.registerNode(new RayHelperNode(this.registry));
        this.registry.data.helper.node.registerNode(new RemoveMeshNode(this.registry));
        // this.registry.data.helper.node.registerNode(new MeshPropertyNode(this.registry));
        this.registry.data.helper.node.registerNode(new TriggerZoneNode(this.registry));
        this.registry.data.helper.node.registerNode(new MeshVisibilityNode(this.registry));
        this.registry.data.helper.node.registerNode(new FilterMeshNode(this.registry));
        this.registry.data.helper.node.registerNode(new AnimationGroupNode(this.registry));
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