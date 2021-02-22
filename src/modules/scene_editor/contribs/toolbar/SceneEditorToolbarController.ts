import { AbstractCanvasPanel, InteractionMode, RedoController, UndoController, ZoomInController, ZoomOutController } from "../../../../core/models/modules/AbstractCanvasPanel";
import { PropContext, ParamController } from "../../../../core/controller/FormController";
import { CommonToolController } from "../../../../core/controller/ToolHandler";
import { Registry } from "../../../../core/Registry";
import { UI_Element } from "../../../../core/ui_components/elements/UI_Element";
import { GameToolId } from "../../main/controllers/tools/GameTool";
import { UIController } from "../../../../core/controller/UIController";
import { UI_Region } from "../../../../core/models/UI_Panel";
import { BasicShapeType, MeshBoxConfig, MeshObj, MeshObjType } from "../../../../core/models/objs/MeshObj";
import { IObj } from "../../../../core/models/objs/IObj";
import { SceneEditorModule } from "../../main/SceneEditorModule";
import { GizmoType } from "../../main/GizmoHandler";

export enum GameViewerProps {
    Play = 'Play',
    Stop = 'Stop',
    EditMode = 'EditMode',
    ExecutionMode = 'ExecutionMode',
    ShowBoundingBoxes = 'ShowBoundingBoxes' 
}

export class SceneEditorToolbarController extends UIController {

    constructor(registry: Registry, canvas: SceneEditorModule) {
        super();

        this.add = new AddNewControl(registry);
        this.editMode = new EditModeController(registry);
        this.interactionMode = new InteractionModeController(registry);
        this.gameViewerTool = new GameViewerToolController(registry);
        this.commonTool = new CommonToolController(registry);
        this.zoomIn = new ZoomInController(registry);
        this.zoomOut = new ZoomOutController(registry);
        this.showBoundingBox = new ShowBoundingBoxController(registry, canvas);
        this.positionGizmo = new PositionGizmoController(registry, canvas);
        this.rotationGizmo = new RotationGizmoController(registry, canvas);
        this.scaleGizmo = new ScaleGizmoController(registry, canvas);
        this.undo = new UndoController(registry);
        this.redo = new RedoController(registry);
    }
    
    add: ParamController;
    editMode: ParamController;
    interactionMode: ParamController;
    gameViewerTool: ParamController;
    commonTool: ParamController;
    zoomIn: ParamController;
    zoomOut: ParamController;
    showBoundingBox: ParamController;
    positionGizmo: PositionGizmoController;
    rotationGizmo: RotationGizmoController;
    scaleGizmo: ScaleGizmoController;
    undo: ParamController;
    redo: ParamController;
}

export class AddNewControl extends ParamController<string> {
    val() {
        return 'Add'
    }

    change(val) {
        switch(val) {
            case 'Mesh':
                MeshObj.CreateMesh(this.registry.services.module.ui.sceneEditor);
                this.registry.services.history.createSnapshot();
            break;
            case 'Cube':
                const config = <MeshBoxConfig> {
                    shapeType: BasicShapeType.Cube,
                    width: 1,
                    height: 1,
                    depth: 1
                };
                MeshObj.CreateBox(config, this.registry.services.module.ui.sceneEditor);
                this.registry.services.history.createSnapshot();
            break;
            case 'Ground':
                const groundConfig = <MeshBoxConfig> {
                    shapeType: BasicShapeType.Ground,
                    width: 50,
                    height: 50
                };
                MeshObj.CreateGround(groundConfig, this.registry.services.module.ui.sceneEditor);
                this.registry.services.history.createSnapshot();
            break;
        }
    }

    values() {
        return ['Add', 'Mesh', 'Cube', 'Ground'];
    }
}

export class PlayController extends ParamController {
    acceptedProps() { return [GameViewerProps.Play]; }

    click(context) {
        context.registry.stores.game.gameState = 'running';
        context.registry.services.render.reRender(context.plugin.region);
    }
}

class PositionGizmoController extends ParamController {
    private canvas: SceneEditorModule;

    constructor(registry: Registry, canvas: SceneEditorModule) {
        super(registry);
        this.canvas = canvas;
    }

    click() {
        if (this.canvas.gizmoHandler.getSelectedGizmo() === GizmoType.Position) {
            this.canvas.gizmoHandler.setSelectedGizmo(undefined);
        } else {
            this.canvas.gizmoHandler.setSelectedGizmo(GizmoType.Position);
        }
        this.registry.services.render.reRender(this.canvas.region);
    }
}

class RotationGizmoController extends ParamController {
    private canvas: SceneEditorModule;

    constructor(registry: Registry, canvas: SceneEditorModule) {
        super(registry);
        this.canvas = canvas;
    }

    click() {
        if (this.canvas.gizmoHandler.getSelectedGizmo() === GizmoType.Rotation) {
            this.canvas.gizmoHandler.setSelectedGizmo(undefined);
        } else {
            this.canvas.gizmoHandler.setSelectedGizmo(GizmoType.Rotation);
        }
        this.registry.services.render.reRender(this.canvas.region);
    }
}

class ScaleGizmoController extends ParamController {
    private canvas: SceneEditorModule;

    constructor(registry: Registry, canvas: SceneEditorModule) {
        super(registry);
        this.canvas = canvas;
    }

    click() {
        if (this.canvas.gizmoHandler.getSelectedGizmo() === GizmoType.Scale) {
            this.canvas.gizmoHandler.setSelectedGizmo(undefined);
        } else {
            this.canvas.gizmoHandler.setSelectedGizmo(GizmoType.Scale);
        }
        this.registry.services.render.reRender(this.canvas.region);
    }
}

class EditModeController extends ParamController {
    acceptedProps() { return [GameViewerProps.EditMode]; }

    click(context: PropContext, element: UI_Element) {
        (element.canvasPanel as AbstractCanvasPanel<IObj>).interactionMode = InteractionMode.Edit;
        context.registry.services.render.reRender(element.canvasPanel.region);
    }
}

class InteractionModeController extends ParamController {
    acceptedProps() { return [GameViewerProps.ExecutionMode]; }

    click(context: PropContext, element: UI_Element) {
        (element.canvasPanel as AbstractCanvasPanel<IObj>).interactionMode = InteractionMode.Execution;
        context.registry.services.render.reRender(element.canvasPanel.region);
    }
}

class GameViewerToolController extends ParamController<any> {
    acceptedProps() { return [GameToolId]; }

    click(context: PropContext, element: UI_Element) {
        element.canvasPanel.tool.setSelectedTool(element.key);
        context.registry.services.render.reRender(element.canvasPanel.region);
    }
}

class ShowBoundingBoxController extends ParamController<boolean> {
    private canvas: SceneEditorModule;

    constructor(registry: Registry, canvas: SceneEditorModule) {
        super(registry);
        this.canvas = canvas;
    }

    click() {
        const show = !this.canvas.showBoundingBoxes;
        this.canvas.showBoundingBoxes = show;
        
        const meshObjs = <MeshObj[]> this.registry.data.scene.items.getByType(MeshObjType);
        meshObjs.forEach(meshObj => this.registry.engine.meshes.showBoundingBoxes(meshObj, show));

        this.registry.services.render.reRender(UI_Region.Canvas2);
    }
}