import { ParamController } from '../../../../../../core/controller/FormController';
import { UIController } from '../../../../../../core/controller/UIController';
import { CanvasAxis } from '../../../../../../core/models/misc/CanvasAxis';
import { MeshBoxConfig, MeshObj } from '../../../../../../core/models/objs/MeshObj';
import { UI_Region } from '../../../../../../core/models/UI_Panel';
import { Registry } from '../../../../../../core/Registry';
import { ApplicationError } from '../../../../../../core/services/ErrorService';
import { MeshLoaderDialogId } from '../../../../../contribs/dialogs/mesh_loader/MeshLoaderDialogModule';
import { PhysicsImpostorDialogDialogId } from '../../../../../contribs/dialogs/physics_impostor/PhysicsImpostorDialogModule';
import { ThumbnailDialogPanelId } from '../../../dialog/thumbnail/ThumbnailDialogModule';
import { toDegree, toRadian } from '../../../../../../utils/geometry/Measurements';
import { MeshShape } from '../../../../main/models/shapes/MeshShape';

export class MeshPropertiesController extends UIController {
    constructor(registry: Registry, meshView: MeshShape) {
        super();

        const meshObj = meshView.getObj();

        this.meshId = new MeshIdController(registry);
        this.layer = new LayerController(registry);
        this.scaleX = new ScaleController(registry, meshObj, CanvasAxis.X);
        this.scaleY = new ScaleController(registry, meshObj, CanvasAxis.Y);
        this.scaleZ = new ScaleController(registry, meshObj, CanvasAxis.Z);
        this.rotateX = new RotationController(registry, CanvasAxis.X);
        this.rotateY = new RotationController(registry, CanvasAxis.Y);
        this.rotateZ = new RotationController(registry, CanvasAxis.Z);
        this.posX = new PositionController(registry, CanvasAxis.X);
        this.posY = new PositionController(registry, CanvasAxis.Y);
        this.posZ = new PositionController(registry, CanvasAxis.Z);
        this.thumbnail = new ThumbnailController(registry);
        this.clone = new CloneController(registry);
        this.model = new ModelController(registry);
        this.width = new WidthController(registry);
        this.height = new HeightController(registry);
        this.depth = new DepthController(registry);
        this.color = new ColorController(registry);
        this.visibility = new MeshVisibilityController(registry);
        this.name = new MeshNameController(registry);
        this.physics = new PhysicsController(registry);
        this.checkIntersection = new CheckIntersectionController(registry, meshObj);
    }

    meshId: MeshIdController;
    layer: LayerController;
    scaleX: ScaleController;
    scaleY: ScaleController;
    scaleZ: ScaleController;
    rotateX: RotationController;
    rotateY: RotationController;
    rotateZ: RotationController;
    posX: PositionController;
    posY: PositionController;
    posZ: PositionController;
    thumbnail: ThumbnailController;
    clone: CloneController;
    model: ModelController;
    width: WidthController;
    height: HeightController;
    depth: DepthController;
    color: ColorController;
    visibility: MeshVisibilityController;
    name: MeshNameController;
    physics: PhysicsController;
    checkIntersection: CheckIntersectionController;
}

export class MeshIdController extends ParamController<string> {
    private tempVal: string;

    val() {
        const meshShape = <MeshShape> this.registry.data.sketch.selection.getAllItems()[0];

        return meshShape.id;
    }
    
    change(val: string) {
        this.tempVal = val;
        this.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    blur() {
        const meshShape = <MeshShape> this.registry.data.sketch.selection.getAllItems()[0];
        meshShape.id = this.tempVal;
        this.tempVal = undefined;
        this.registry.services.history.createSnapshot();
        this.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
    }    
}

export class LayerController extends ParamController<number> {
    val() {
        const meshShape = <MeshShape> this.registry.data.sketch.selection.getAllItems()[0];

        return meshShape.layer;
    }

    change(val) {
        const meshShape = <MeshShape> this.registry.data.sketch.selection.getAllItems()[0];

        meshShape.layer = val;
        this.registry.services.history.createSnapshot();
        this.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
    }
}

export class ScaleController extends ParamController {
    private axis: CanvasAxis;
    private tempVal: string;
    private meshObj: MeshObj;

    constructor(registry: Registry, meshObj: MeshObj, axis: CanvasAxis) {
        super(registry);
        this.axis = axis;
        this.meshObj = meshObj;
    }

    val() {
        if (this.tempVal !== undefined) {
            return this.tempVal;
        } else {
            return CanvasAxis.getAxisVal(this.meshObj.getScale(), this.axis);
        }
    }

    change(val: string) {
        this.tempVal = val;
        this.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    blur() {
        try {
            if (this.tempVal !== undefined && this.tempVal !== "") {
                const scale = this.meshObj.getScale();
                const axisScale = parseFloat(this.tempVal);
                CanvasAxis.setAxisVal(scale, this.axis, axisScale);
                this.meshObj.setScale(scale);
                this.registry.services.history.createSnapshot();
            }
        } catch(e) {
            this.registry.services.error.setError(new ApplicationError(e));
        } finally {
            this.tempVal = undefined;
        }

        this.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
    }
}

export class RotationController extends ParamController {
    private axis: CanvasAxis;
    private tempVal: string;

    constructor(registry: Registry, axis: CanvasAxis) {
        super(registry);
        this.axis = axis;
    }

    val() {
        if (this.tempVal !== undefined) {
            return this.tempVal;
        } else {
            const meshShape = <MeshShape> this.registry.data.sketch.selection.getAllItems()[0];

            const rotRad = CanvasAxis.getAxisVal(meshShape.getObj().getRotation(), this.axis);
            return Math.round(toDegree(rotRad));
        }
    }

    change(val: string) {
        this.tempVal = val
        this.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    blur() {
        const meshShape = <MeshShape> this.registry.data.sketch.selection.getAllItems()[0];

        try {
            if (this.tempVal !== undefined && this.tempVal !== "") {
                const rotation = meshShape.getObj().getRotation();
                const rot = toRadian(parseFloat(this.tempVal));
                
                if (this.axis === CanvasAxis.Y) {
                    meshShape.setRotation(rot);
                } else {
                    CanvasAxis.setAxisVal(rotation, this.axis, rot);
                    meshShape.getObj().setRotation(rotation)
                }

                this.registry.services.history.createSnapshot();
            }
        } catch(e) {
            this.registry.services.error.setError(new ApplicationError(e));
        } finally {
            this.tempVal = undefined;
        }

        this.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
    }
}

export class PositionController extends ParamController {
    private axis: CanvasAxis;
    private tempVal: string;

    constructor(registry: Registry, axis: CanvasAxis) {
        super(registry);
        this.axis = axis;
    }

    val() {
        if (this.tempVal !== undefined) {
            return this.tempVal;
        } else {
            const meshShape = <MeshShape> this.registry.data.sketch.selection.getAllItems()[0];

            return CanvasAxis.getAxisVal(meshShape.getObj().getPosition(), this.axis);
        }
    }

    change(val: string) {
        this.tempVal = val;
        this.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    blur() {
        const meshShape = <MeshShape> this.registry.data.sketch.selection.getAllItems()[0];

        try {
            if (this.tempVal !== undefined && this.tempVal !== "") {
                const position = meshShape.getObj().getPosition();
                const axisPosition = parseFloat(this.tempVal);
                CanvasAxis.setAxisVal(position, this.axis, axisPosition);
                meshShape.getObj().setPosition(position);
                this.registry.services.history.createSnapshot();
            }
        } catch(e) {
            this.registry.services.error.setError(new ApplicationError(e));
        } finally {
            this.tempVal = undefined;
        }

        this.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
    }
}

export class ThumbnailController extends ParamController {
    click() {
        const dialog = this.registry.services.module.ui.getPanel(ThumbnailDialogPanelId);
        this.registry.ui.helper.setDialogPanel(dialog);
        this.registry.services.render.reRender(UI_Region.Dialog);
    }
}

export class CloneController extends ParamController {
    click() {
        const meshShape = <MeshShape> this.registry.data.sketch.selection.getAllItems()[0];

        meshShape.deepClone(this.registry);

        this.registry.services.history.createSnapshot();
        this.registry.services.render.reRenderAll();
    }
}

export class ModelController extends ParamController {
    constructor(registry: Registry) {
        super(registry);
    }

    click() {
        const dialog = this.registry.services.module.ui.getPanel(MeshLoaderDialogId);
        this.registry.ui.helper.setDialogPanel(dialog);
        this.registry.services.render.reRenderAll();
    }
}

export class PhysicsController extends ParamController {
    constructor(registry: Registry) {
        super(registry);
    }

    click() {
        const dialog = this.registry.services.module.ui.getPanel(PhysicsImpostorDialogDialogId);
        this.registry.ui.helper.setDialogPanel(dialog);
        this.registry.services.render.reRenderAll();
    }
}

export class WidthController extends ParamController {
    private tempVal: string;

    constructor(registry: Registry) {
        super(registry);
    }

    val() {
        if (this.tempVal !== undefined) {
            return this.tempVal;
        } else {
            const meshShape = <MeshShape> this.registry.data.sketch.selection.getAllItems()[0];

            return (<MeshBoxConfig> meshShape.getObj().shapeConfig).width;
        }
    }

    change(val: string) {
        this.tempVal = val;
        this.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    async blur() {
        const meshShape = <MeshShape> this.registry.data.sketch.selection.getAllItems()[0];

        try {
            if (this.tempVal !== undefined && this.tempVal !== "") {
                (<MeshBoxConfig> meshShape.getObj().shapeConfig).width = parseFloat(this.tempVal);
                this.registry.engine.meshes.deleteInstance(meshShape.getObj());
                await this.registry.engine.meshes.createInstance(meshShape.getObj());
                this.registry.services.history.createSnapshot();
            }
        } catch(e) {
            this.registry.services.error.setError(new ApplicationError(e));
        } finally {
            this.tempVal = undefined;
        }

        this.registry.services.render.reRenderAll();
    }
}

export class HeightController extends ParamController {
    private tempVal: string;

    constructor(registry: Registry) {
        super(registry);
    }

    val() {
        if (this.tempVal !== undefined) {
            return this.tempVal;
        } else {
            const meshShape = <MeshShape> this.registry.data.sketch.selection.getAllItems()[0];
    
            return (<MeshBoxConfig> meshShape.getObj().shapeConfig).height;
        }
    }

    change(val: string) {
        this.tempVal = val;
        this.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    async blur() {
        const meshShape = <MeshShape> this.registry.data.sketch.selection.getAllItems()[0];

        try {
            if (this.tempVal !== undefined && this.tempVal !== "") {
                (<MeshBoxConfig> meshShape.getObj().shapeConfig).height = parseFloat(this.tempVal);
                this.registry.engine.meshes.deleteInstance(meshShape.getObj());
                await this.registry.engine.meshes.createInstance(meshShape.getObj())
                this.registry.services.history.createSnapshot();
            }
        } catch(e) {
            this.registry.services.error.setError(new ApplicationError(e));
        } finally {
            this.tempVal = undefined;
        }

        this.registry.services.render.reRenderAll();
    }
}

export class DepthController extends ParamController {
    private tempVal: string;

    constructor(registry: Registry) {
        super(registry);
    }

    val() {
        if (this.tempVal !== undefined) {
            return this.tempVal;
        } else {
            const meshShape = <MeshShape> this.registry.data.sketch.selection.getAllItems()[0];

            return (<MeshBoxConfig> meshShape.getObj().shapeConfig).depth;
        }
    }

    change(val: string) {
        this.tempVal = val;
        this.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    async blur() {
        const meshShape = <MeshShape> this.registry.data.sketch.selection.getAllItems()[0];

        try {
            if (this.tempVal !== undefined && this.tempVal !== "") {
                (<MeshBoxConfig> meshShape.getObj().shapeConfig).depth = parseFloat(this.tempVal);
                this.registry.engine.meshes.deleteInstance(meshShape.getObj());
                await this.registry.engine.meshes.createInstance(meshShape.getObj())
                this.registry.services.history.createSnapshot();
            }
        } catch(e) {
            this.registry.services.error.setError(new ApplicationError(e));
        } finally {
            this.tempVal = undefined;
        }
        

        this.registry.services.render.reRenderAll();
    }
}

export class ColorController extends ParamController {
    private tempVal: string;

    constructor(registry: Registry) {
        super(registry);
    }

    val() {
        if (this.tempVal !== undefined) {
            return this.tempVal;
        } else {
            const meshShape = <MeshShape> this.registry.data.sketch.selection.getAllItems()[0];
    
            return meshShape.getObj().getColor();
        }
    }

    change(val: string) {
        this.tempVal = val;
        this.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    async blur() {
        const meshShape = <MeshShape> this.registry.data.sketch.selection.getAllItems()[0];

        try {
            if (this.tempVal !== undefined && this.tempVal !== "") {
                meshShape.getObj().setColor(this.tempVal);
                this.registry.services.history.createSnapshot();
            }
        } catch(e) {
            this.registry.services.error.setError(new ApplicationError(e));
        } finally {
            this.tempVal = undefined;
        }
        
        this.registry.services.render.reRenderAll();
    }
}

export class MeshVisibilityController extends ParamController {
    private tempVal: string;
    constructor(registry: Registry) {
        super(registry);
    }

    val() {
        if (this.tempVal !== undefined) {
            return this.tempVal;
        } else {
            const meshShape = <MeshShape> this.registry.data.sketch.selection.getAllItems()[0];

            return meshShape.getObj().getVisibility();
        }
    }

    change(val: string) {
        this.tempVal = val;
        this.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    async blur() {
        const meshShape = <MeshShape> this.registry.data.sketch.selection.getAllItems()[0];

        try {
            if (this.tempVal !== undefined && this.tempVal !== "") {
                meshShape.getObj().setVisibility(parseFloat(this.tempVal));
                this.registry.services.history.createSnapshot();
            }
        } catch(e) {
            this.registry.services.error.setError(new ApplicationError(e));
        } finally {
            this.tempVal = undefined;
        }

        this.registry.services.render.reRenderAll();
    }
}

export class MeshNameController extends ParamController<string> {
    private tempVal: string;

    val() {
        const meshShape = <MeshShape> this.registry.data.sketch.selection.getAllItems()[0];

        return this.tempVal !== undefined ? this.tempVal : meshShape.getObj().name;
    }
    
    change(val: string) {
        this.tempVal = val;
        this.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    blur() {
        const meshShape = <MeshShape> this.registry.data.sketch.selection.getAllItems()[0];

        meshShape.getObj().name = this.tempVal;
        this.tempVal = undefined;
        this.registry.services.history.createSnapshot();
        this.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
    }    
}

export class CheckIntersectionController extends ParamController {
    private meshObj: MeshObj;

    constructor(registry: Registry, meshObj: MeshObj) {
        super(registry);
        this.meshObj = meshObj;
    }

    val() {
        return this.meshObj.isCheckIntersection; 
    }

    change(val: boolean) {
        this.meshObj.isCheckIntersection = val;

        this.registry.services.history.createSnapshot();
        this.registry.services.render.reRender(UI_Region.Sidepanel);
    }
}