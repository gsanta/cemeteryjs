import { CanvasAxis } from '../../../../../../core/models/misc/CanvasAxis';
import { FormController, ParamController } from '../../../../../../core/controller/FormController';
import { UI_Region } from '../../../../../../core/plugin/UI_Panel';
import { Registry } from '../../../../../../core/Registry';
import { ApplicationError } from '../../../../../../core/services/ErrorService';
import { toDegree } from '../../../../../../utils/geometry/Measurements';
import { Point_3 } from '../../../../../../utils/geometry/shapes/Point_3';
import { LightShape } from '../../../../main/models/shapes/LightShape';
import { MeshShape, MeshShapeType } from '../../../../main/models/shapes/MeshShape';
import { UIController } from '../../../../../../core/controller/UIController';

export class LightPropertiesController extends UIController {
    constructor(registry: Registry) {
        super();
        this.posY = new LightYPosController(registry);
        this.dirX = new LightDirController(registry, CanvasAxis.X);
        this.dirY = new LightDirController(registry, CanvasAxis.Y);
        this.dirZ = new LightDirController(registry, CanvasAxis.Z);
        this.angle = new LightAngleController(registry);
        this.diffuseColor = new LightDiffuseColorController(registry);
        this.parent = new LightParentMeshController(registry);
    }

    posY: LightYPosController;
    dirX: LightDirController;
    dirY: LightDirController;
    dirZ: LightDirController;
    angle: LightAngleController;
    diffuseColor: LightDiffuseColorController;
    parent: LightParentMeshController;
}

export class LightYPosController extends ParamController {
    private tempVal: string;

    constructor(registry: Registry) {
        super(registry);
    }
    
    val() {
        if (this.tempVal) {
            return this.tempVal;
        } else {
            const lightView = <LightShape> this.registry.data.shape.scene.getOneSelectedShape();
    
            return lightView.getObj().getPosition().y;
        }
    }

    change(val: string) {
        this.tempVal = val;
        this.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    blur() {
        const lightView = <LightShape> this.registry.data.shape.scene.getOneSelectedShape();
        
        try {
            if (this.tempVal !== undefined && this.tempVal !== "") {
                const pos = lightView.getObj().getPosition();
                const yPos = parseFloat(this.tempVal);                
                lightView.getObj().setPosition(new Point_3(pos.x, yPos, pos.z));
                this.registry.services.history.createSnapshot();
            }
        } catch(e) {
            this.registry.services.error.setError(new ApplicationError(e));
        } finally {
            this.tempVal = undefined;
            this.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
        }
    }
}

export class LightDirController extends ParamController {
    private tempVal: string;
    private axis: CanvasAxis;

    constructor(registry: Registry, axis: CanvasAxis) {
        super(registry);
        this.axis = axis;
    }

    val() {
        if (this.tempVal) {
            return this.tempVal;
        } else {
            const lightView = <LightShape> this.registry.data.shape.scene.getOneSelectedShape();
    
            return this.getVal(lightView);
        }
    }

    change(val: string) {
        this.tempVal = val;
        this.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    blur() {
        const lightView = <LightShape> this.registry.data.shape.scene.getOneSelectedShape();

        try {
            if (this.tempVal !== undefined && this.tempVal !== "") {
                this.setVal(lightView, this.tempVal);
            }
        } catch(e) {
            this.registry.services.error.setError(new ApplicationError(e));
        } finally {
            this.tempVal = undefined;
            this.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
        }

    }

    private setVal(view: LightShape, val: string) {
        const currDir = view.getObj().getDirection();

        const valNum = FormController.parseFloat(val);

        switch(this.axis) {
            case CanvasAxis.X:
                return view.getObj().setDirection(new Point_3(valNum, currDir.y, currDir.z));
            case CanvasAxis.Y:
                return view.getObj().setDirection(new Point_3(currDir.x, valNum, currDir.z));
            case CanvasAxis.Z:
                return view.getObj().setDirection(new Point_3(currDir.x, currDir.y, valNum));    
        }
    }

    private getVal(view: LightShape) {
        switch(this.axis) {
            case CanvasAxis.X:
                return view.getObj().getDirection().x;
            case CanvasAxis.Y:
                return view.getObj().getDirection().y;
            case CanvasAxis.Z:
                return view.getObj().getDirection().z;    
        }
    }
}

export class LightAngleController extends ParamController {
    private tempVal: string;

    constructor(registry: Registry) {
        super(registry);
    }

    val() {
        if (this.tempVal) {
            return this.tempVal;
        } else {
            const lightView = <LightShape> this.registry.data.shape.scene.getOneSelectedShape();
    
            return toDegree(lightView.getObj().getAngle());
        }
    }

    change(val: string) {
        this.tempVal = val;
        this.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    blur() {
        const lightView = <LightShape> this.registry.data.shape.scene.getOneSelectedShape();

        try {
            if (this.tempVal !== undefined && this.tempVal !== "") {
                const angle = parseFloat(this.tempVal);
                lightView.getObj().setAngle(angle);
            }
        } catch(e) {
            this.registry.services.error.setError(new ApplicationError(e));
        } finally {
            this.tempVal = undefined;
            this.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
        }
    }
}

export class LightDiffuseColorController extends ParamController {
    private tempVal: string;

    constructor(registry: Registry) {
        super(registry);
    }

    val() {
        if (this.tempVal) {
            return this.tempVal;
        } else {
            const lightView = <LightShape> this.registry.data.shape.scene.getOneSelectedShape();
    
            return lightView.getObj().getDiffuseColor();
        }
    }

    change(val: string) {
        this.tempVal = val;
        this.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    blur() {
        const lightView = <LightShape> this.registry.data.shape.scene.getOneSelectedShape();

        try {
            if (this.tempVal !== undefined && this.tempVal !== "") {
                lightView.getObj().setDiffuseColor(this.tempVal);
                this.registry.services.history.createSnapshot();
            }
        } catch(e) {
            this.registry.services.error.setError(new ApplicationError(e));
        } finally {
            this.tempVal = undefined;
            this.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
        }
    }
}

export class LightParentMeshController extends ParamController {
    values() {
        return this.registry.data.shape.scene.getShapesByType(MeshShapeType).map(obj => obj.id)
    }

    val() {
        const lightView = <LightShape> this.registry.data.shape.scene.getOneSelectedShape();
        return lightView.getParent() && lightView.getParent().id;
    }

    change(val: string) {
        const lightView = <LightShape> this.registry.data.shape.scene.getOneSelectedShape();
        const meshView = <MeshShape> this.registry.data.shape.scene.getItemById(val);

        if (meshView) {
            lightView.setParent(meshView);
            this.registry.services.history.createSnapshot();
            this.registry.services.render.reRender(UI_Region.Sidepanel);
        }
    }
}
