import { ParamController } from '../../../../../../core/controller/FormController';
import { UIController } from '../../../../../../core/controller/UIController';
import { CanvasAxis } from '../../../../../../core/models/misc/CanvasAxis';
import { MeshBoxConfig, MeshObj } from '../../../../../../core/models/objs/MeshObj';
import { UI_Region } from '../../../../../../core/models/UI_Panel';
import { Registry } from '../../../../../../core/Registry';
import { ApplicationError } from '../../../../../../core/services/ErrorService';
import { MeshLoaderDialogId } from '../../../../../contribs/dialogs/mesh_loader/MeshLoaderDialogModule';
import { PhysicsImpostorDialogDialogId } from '../../../../../contribs/dialogs/physics_impostor/PhysicsImpostorDialogModule';
import { toDegree, toRadian } from '../../../../../../utils/geometry/Measurements';
import { Point_3 } from '../../../../../../utils/geometry/shapes/Point_3';

export class MeshPropertiesController extends UIController {
    constructor(registry: Registry, meshObj: MeshObj) {
        super();

        this.meshId = new MeshIdController(registry);
        this.scaleX = new ScaleController(registry, meshObj, CanvasAxis.X);
        this.scaleY = new ScaleController(registry, meshObj, CanvasAxis.Y);
        this.scaleZ = new ScaleController(registry, meshObj, CanvasAxis.Z);
        this.rotateX = new RotationController(registry, CanvasAxis.X);
        this.rotateY = new RotationController(registry, CanvasAxis.Y);
        this.rotateZ = new RotationController(registry, CanvasAxis.Z);
        this.posX = new PositionController(registry, CanvasAxis.X);
        this.posY = new PositionController(registry, CanvasAxis.Y);
        this.posZ = new PositionController(registry, CanvasAxis.Z);
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
    scaleX: ScaleController;
    scaleY: ScaleController;
    scaleZ: ScaleController;
    rotateX: RotationController;
    rotateY: RotationController;
    rotateZ: RotationController;
    posX: PositionController;
    posY: PositionController;
    posZ: PositionController;
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
        const meshObj = this.registry.data.scene.items.getByTag('select')[0];

        return meshObj.id;
    }
    
    change(val: string) {
        this.tempVal = val;
        this.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    blur() {
        const meshObj = this.registry.data.scene.items.getByTag('select')[0];
        meshObj.id = this.tempVal;
        this.tempVal = undefined;
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
            const meshObj = <MeshObj> this.registry.data.scene.items.getByTag('select')[0];

            const rotRad = CanvasAxis.getAxisVal(meshObj.getRotation(), this.axis);
            return Math.round(toDegree(rotRad));
        }
    }

    change(val: string) {
        this.tempVal = val
        this.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    blur() {
        const meshObj = <MeshObj> this.registry.data.scene.items.getByTag('select')[0];

        try {
            if (this.tempVal !== undefined && this.tempVal !== "") {
                const rotation = meshObj.getRotation();
                const rot = toRadian(parseFloat(this.tempVal));
                
                if (this.axis === CanvasAxis.Y) {
                    meshObj.setRotation(new Point_3(rot, rot, rot));
                } else {
                    CanvasAxis.setAxisVal(rotation, this.axis, rot);
                    meshObj.setRotation(rotation)
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
            const meshObj = <MeshObj> this.registry.data.scene.items.getByTag('select')[0];

            return CanvasAxis.getAxisVal(meshObj.getPosition(), this.axis);
        }
    }

    change(val: string) {
        this.tempVal = val;
        this.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    blur() {
        const meshObj = <MeshObj> this.registry.data.scene.items.getByTag('select')[0];

        try {
            if (this.tempVal !== undefined && this.tempVal !== "") {
                const position = meshObj.getPosition();
                const axisPosition = parseFloat(this.tempVal);
                CanvasAxis.setAxisVal(position, this.axis, axisPosition);
                meshObj.setPosition(position);
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

export class CloneController extends ParamController {
    click() {
        const meshObj = <MeshObj> this.registry.data.scene.items.getByTag('select')[0];

        meshObj.clone(this.registry);

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
            const meshObj = <MeshObj> this.registry.data.scene.items.getByTag('select')[0];

            return (<MeshBoxConfig> meshObj.shapeConfig).width;
        }
    }

    change(val: string) {
        this.tempVal = val;
        this.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    async blur() {
        const meshObj = <MeshObj> this.registry.data.scene.items.getByTag('select')[0];

        try {
            if (this.tempVal !== undefined && this.tempVal !== "") {
                (<MeshBoxConfig> meshObj.shapeConfig).width = parseFloat(this.tempVal);
                this.registry.engine.meshes.deleteInstance(meshObj);
                await this.registry.engine.meshes.createInstance(meshObj);
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
            const meshObj = <MeshObj> this.registry.data.scene.items.getByTag('select')[0];
    
            return (<MeshBoxConfig> meshObj.shapeConfig).height;
        }
    }

    change(val: string) {
        this.tempVal = val;
        this.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    async blur() {
        const meshObj = <MeshObj> this.registry.data.scene.items.getByTag('select')[0];

        try {
            if (this.tempVal !== undefined && this.tempVal !== "") {
                (<MeshBoxConfig> meshObj.shapeConfig).height = parseFloat(this.tempVal);
                this.registry.engine.meshes.deleteInstance(meshObj);
                await this.registry.engine.meshes.createInstance(meshObj)
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
            const meshObj = <MeshObj> this.registry.data.scene.items.getByTag('select')[0];

            return (<MeshBoxConfig> meshObj.shapeConfig).depth;
        }
    }

    change(val: string) {
        this.tempVal = val;
        this.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    async blur() {
        const meshObj = <MeshObj> this.registry.data.scene.items.getByTag('select')[0];

        try {
            if (this.tempVal !== undefined && this.tempVal !== "") {
                (<MeshBoxConfig> meshObj.shapeConfig).depth = parseFloat(this.tempVal);
                this.registry.engine.meshes.deleteInstance(meshObj);
                await this.registry.engine.meshes.createInstance(meshObj)
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
            const meshObj = <MeshObj> this.registry.data.scene.items.getByTag('select')[0];
    
            return meshObj.getColor();
        }
    }

    change(val: string) {
        this.tempVal = val;
        this.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    async blur() {
        const meshObj = <MeshObj> this.registry.data.scene.items.getByTag('select')[0];

        try {
            if (this.tempVal !== undefined && this.tempVal !== "") {
                meshObj.setColor(this.tempVal);
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
            const meshObj = <MeshObj> this.registry.data.scene.items.getByTag('select')[0];

            return meshObj.getVisibility();
        }
    }

    change(val: string) {
        this.tempVal = val;
        this.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    async blur() {
        const meshObj = <MeshObj> this.registry.data.scene.items.getByTag('select')[0];

        try {
            if (this.tempVal !== undefined && this.tempVal !== "") {
                meshObj.setVisibility(parseFloat(this.tempVal));
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
        const meshObj = <MeshObj> this.registry.data.scene.items.getByTag('select')[0];

        return this.tempVal !== undefined ? this.tempVal : meshObj.name;
    }
    
    change(val: string) {
        this.tempVal = val;
        this.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    blur() {
        const meshObj = <MeshObj> this.registry.data.scene.items.getByTag('select')[0];

        meshObj.name = this.tempVal;
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