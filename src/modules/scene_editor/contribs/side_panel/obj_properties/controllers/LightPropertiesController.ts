import { CanvasAxis } from '../../../../../../core/models/misc/CanvasAxis';
import { FormController, ParamController } from '../../../../../../core/controller/FormController';
import { UI_Region } from '../../../../../../core/models/UI_Panel';
import { Registry } from '../../../../../../core/Registry';
import { ApplicationError } from '../../../../../../core/services/ErrorService';
import { toDegree } from '../../../../../../utils/geometry/Measurements';
import { Point_3 } from '../../../../../../utils/geometry/shapes/Point_3';
import { UIController } from '../../../../../../core/controller/UIController';
import { LightObj } from '../../../../../../core/models/objs/LightObj';
import { MeshObj, MeshObjType } from '../../../../../../core/models/objs/MeshObj';

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
            const lightObj = <LightObj> this.registry.data.scene.items.getByTag('select')[0];
    
            return lightObj.getPosition().y;
        }
    }

    change(val: string) {
        this.tempVal = val;
        this.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    blur() {
        const lightObj = <LightObj> this.registry.data.scene.items.getByTag('select')[0];
        
        try {
            if (this.tempVal !== undefined && this.tempVal !== "") {
                const pos = lightObj.getPosition();
                const yPos = parseFloat(this.tempVal);                
                lightObj.setPosition(new Point_3(pos.x, yPos, pos.z));
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
            const lightObj = <LightObj> this.registry.data.scene.items.getByTag('select')[0];    
            return this.getVal(lightObj);
        }
    }

    change(val: string) {
        this.tempVal = val;
        this.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    blur() {
        const lightObj = <LightObj> this.registry.data.scene.items.getByTag('select')[0];    

        try {
            if (this.tempVal !== undefined && this.tempVal !== "") {
                this.setVal(lightObj, this.tempVal);
            }
        } catch(e) {
            this.registry.services.error.setError(new ApplicationError(e));
        } finally {
            this.tempVal = undefined;
            this.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
        }

    }

    private setVal(obj: LightObj, val: string) {
        const currDir = obj.getDirection();

        const valNum = FormController.parseFloat(val);

        switch(this.axis) {
            case CanvasAxis.X:
                return obj.setDirection(new Point_3(valNum, currDir.y, currDir.z));
            case CanvasAxis.Y:
                return obj.setDirection(new Point_3(currDir.x, valNum, currDir.z));
            case CanvasAxis.Z:
                return obj.setDirection(new Point_3(currDir.x, currDir.y, valNum));    
        }
    }

    private getVal(obj: LightObj) {
        switch(this.axis) {
            case CanvasAxis.X:
                return obj.getDirection().x;
            case CanvasAxis.Y:
                return obj.getDirection().y;
            case CanvasAxis.Z:
                return obj.getDirection().z;    
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
            const lightObj = <LightObj> this.registry.data.scene.items.getByTag('select')[0];
    
            return toDegree(lightObj.getAngle());
        }
    }

    change(val: string) {
        this.tempVal = val;
        this.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    blur() {
        const lightObj = <LightObj> this.registry.data.scene.items.getByTag('select')[0];

        try {
            if (this.tempVal !== undefined && this.tempVal !== "") {
                const angle = parseFloat(this.tempVal);
                lightObj.setAngle(angle);
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
            const lightObj = <LightObj> this.registry.data.scene.items.getByTag('select')[0];

            return lightObj.getDiffuseColor();
        }
    }

    change(val: string) {
        this.tempVal = val;
        this.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    blur() {
        const lightObj = <LightObj> this.registry.data.scene.items.getByTag('select')[0];

        try {
            if (this.tempVal !== undefined && this.tempVal !== "") {
                lightObj.setDiffuseColor(this.tempVal);
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
        return this.registry.data.scene.items.getByType(MeshObjType).map(obj => obj.id)
    }

    val() {
        const lightObj = <LightObj> this.registry.data.scene.items.getByTag('select')[0];
        return lightObj.getParent() && lightObj.getParent().id;
    }

    change(val: string) {
        const lightObj = <LightObj> this.registry.data.scene.items.getByTag('select')[0];
        const meshObj = <MeshObj> this.registry.data.scene.items.getById(val);

        if (meshObj) {
            lightObj.setParent(meshObj);
            this.registry.services.history.createSnapshot();
            this.registry.services.render.reRender(UI_Region.Sidepanel);
        }
    }
}
