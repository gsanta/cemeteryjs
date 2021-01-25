import { registerSceneEditor } from '../modules/scene_editor/main/registerSceneEditor';
import { AnimationGroupNode } from '../modules/graph_editor/main/models/nodes/AnimationGroupNode';
import { FilterMeshNode } from '../modules/graph_editor/main/models/nodes/FilterMeshNode';
import { KeyboardNode } from '../modules/graph_editor/main/models/nodes/KeyboardNode';
import { MeshNode } from '../modules/graph_editor/main/models/nodes/MeshNode';
import { MeshVisibilityNode } from '../modules/graph_editor/main/models/nodes/MeshVisibilityNode';
import { MoveNode } from '../modules/graph_editor/main/models/nodes/MoveNode';
import { RayCasterNode } from '../modules/graph_editor/main/models/nodes/RayCasterNode';
import { RayHelperNode } from '../modules/graph_editor/main/models/nodes/RayHelperNode';
import { RemoveMeshNode } from '../modules/graph_editor/main/models/nodes/RemoveMeshNode';
import { RotateNode } from '../modules/graph_editor/main/models/nodes/RotateNode';
import { TriggerZoneNode } from '../modules/graph_editor/main/models/nodes/TriggerZoneNode';
import { registerNodeEditor } from '../modules/graph_editor/registerNodeEditor';
import { registerNodeSelectorPlugin } from '../modules/graph_editor/contribs/side_panel/node_library/registerNodeLibraryPlugin';
import { registerObjProperties } from '../modules/sketch_editor/contribs/side_panel/obj_properties/registerObjProperties';
import { registerSketchEditor } from '../modules/sketch_editor/main/registerSketchEditor';
import { registerMeshLoaderDialog } from '../modules/contribs/dialogs/mesh_loader/registerMeshLoaderDialog';
import { registerSpriteSheetManagerDialog } from '../modules/contribs/dialogs/spritesheet_manager/registerSpriteSheetManagerDialog';
import { registerThumbnailCanvas } from '../modules/sketch_editor/contribs/dialog/thumbnail/registerThumbnailCanvas';
import { registerThumbnaildialog } from '../modules/sketch_editor/contribs/dialog/thumbnail/registerThumbnailDialog';
import { registerAssetManagerPanel } from '../modules/contribs/side_panel/asset_manager/registerAssetManagerPanel';
import { registerFileSettingsPanel } from '../modules/contribs/side_panel/file_settings/registerFileSettingsPanel';
import { registerLayoutSettingsPanel } from '../modules/contribs/side_panel/layout_settings/registerLayoutSettingsPanel';
import { registerLevelSettingsPanel } from '../modules/contribs/side_panel/level_settings/registerLevelSettingsPlugin';
import { Registry } from './Registry';
import { NodeGraphHook } from './services/NodePlugin';
import { ObjLifeCycleHook } from './stores/ObjStore';
import { AxisControlHook, ShapeLifeCycleHook } from './stores/ShapeStore';
import { registerPhysicsImpostorDialog } from '../modules/contribs/dialogs/physics_impostor/registerPhysicsImpostorDialog';
import { CollisionNode } from '../modules/graph_editor/main/models/nodes/CollisionNode';
import { DirectionNode } from '../modules/graph_editor/main/models/nodes/DirectionNode';
import { ArrayNode } from '../modules/graph_editor/main/models/nodes/ArrayNode';

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
        this.registry.data.shape.scene.addHook(new ShapeLifeCycleHook(this.registry));
        this.registry.data.shape.node.addHook(new ShapeLifeCycleHook(this.registry));
        this.registry.data.shape.node.addHook(new NodeGraphHook(this.registry));
        
        this.registry.data.shape.scene.addHook(new AxisControlHook(this.registry));

        // side panels
        registerAssetManagerPanel(this.registry);
        registerNodeSelectorPlugin(this.registry);
        registerAssetManagerPanel(this.registry);
        registerFileSettingsPanel(this.registry);
        registerLayoutSettingsPanel(this.registry);
        registerObjProperties(this.registry);
        registerLevelSettingsPanel(this.registry)

        // dialogs
        registerThumbnaildialog(this.registry);
        registerSpriteSheetManagerDialog(this.registry);
        registerMeshLoaderDialog(this.registry);
        registerPhysicsImpostorDialog(this.registry);

        registerSketchEditor(this.registry);
        registerNodeEditor(this.registry);
        registerSceneEditor(this.registry);
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
        this.registry.data.helper.node.registerNode(new CollisionNode(this.registry));
        this.registry.data.helper.node.registerNode(new DirectionNode(this.registry));
        this.registry.data.helper.node.registerNode(new ArrayNode(this.registry));
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