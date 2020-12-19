import { CanvasAxis } from '../../../../core/models/misc/CanvasAxis';
import { FormController, PropContext, PropController } from '../../../../core/plugin/controller/FormController';
import { UI_Region } from '../../../../core/plugin/UI_Panel';
import { Registry } from '../../../../core/Registry';
import { ApplicationError } from '../../../../core/services/ErrorService';
import { toDegree, toRadian } from '../../../../utils/geometry/Measurements';
import { Point_3 } from '../../../../utils/geometry/shapes/Point_3';
import { LightView } from './LightView';
import { MeshView, MeshViewType } from './MeshView';

export enum LightViewControllerParam {
    LightYPos = 'light-pos-y',
    LightAngle = 'LightAngle',

    LightDirX = 'light-dir-x',
    LightDirY = 'light-dir-y',
    LightDirZ = 'light-dir-z',
    LightColorDiffuse = 'light-color-diffuse',
    LightParentMesh = 'light-parent-mesh'
}

export class LightYPosController extends PropController<string> {
    private registry: Registry;

    constructor(registry: Registry) {
        super(registry);
        this.registry = registry;
    }
    
    acceptedProps() { return [LightViewControllerParam.LightYPos]; }

    defaultVal(context: PropContext) {
        const lightView = <LightView> context.registry.data.view.scene.getOneSelectedView();

        return lightView.getObj().getPosition().y;
    }

    change(val, context: PropContext) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    blur(context: PropContext) {
        const lightView = <LightView> context.registry.data.view.scene.getOneSelectedView();
        
        try {
            if (context.getTempVal() !== undefined && context.getTempVal() !== "") {
                const pos = lightView.getObj().getPosition();
                const yPos = parseFloat(context.getTempVal());                
                lightView.getObj().setPosition(new Point_3(pos.x, yPos, pos.z));
                context.registry.services.history.createSnapshot();
            }
        } catch(e) {
            this.registry.services.error.setError(new ApplicationError(e));
        } finally {
            context.clearTempVal();
            context.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
        }
    }
}

export class LightDirController extends PropController<string> {
    private prop: LightViewControllerParam;
    private registry: Registry;

    acceptedProps() { return [this.prop]; }

    constructor(registry: Registry, axis: CanvasAxis) {
        super(registry);
        this.registry = registry;
        switch(axis) {
            case CanvasAxis.X:
                this.prop = LightViewControllerParam.LightDirX;
                break;
            case CanvasAxis.Y:
                this.prop = LightViewControllerParam.LightDirY;
                break;
            case CanvasAxis.Z:
                this.prop = LightViewControllerParam.LightDirZ;
                break;
        }
    }

    defaultVal(context: PropContext) {
        const lightView = <LightView> context.registry.data.view.scene.getOneSelectedView();

        return this.getVal(lightView);
    }

    change(val, context: PropContext) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    blur(context: PropContext) {
        const lightView = <LightView> context.registry.data.view.scene.getOneSelectedView();

        try {
            if (context.getTempVal() !== undefined && context.getTempVal() !== "") {
                const val = context.getTempVal() || this.defaultVal(context);
                this.setVal(lightView, val);
            }
        } catch(e) {
            this.registry.services.error.setError(new ApplicationError(e));
        } finally {
            context.clearTempVal();
            context.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
        }

    }

    private setVal(view: LightView, val: string) {
        const currDir = view.getObj().getDirection();

        const valNum = FormController.parseFloat(val);

        switch(this.prop) {
            case LightViewControllerParam.LightDirX:
                return view.getObj().setDirection(new Point_3(valNum, currDir.y, currDir.z));
            case LightViewControllerParam.LightDirY:
                return view.getObj().setDirection(new Point_3(currDir.x, valNum, currDir.z));
            case LightViewControllerParam.LightDirZ:
                return view.getObj().setDirection(new Point_3(currDir.x, currDir.y, valNum));    
        }
    }

    private getVal(view: LightView) {
        switch(this.prop) {
            case LightViewControllerParam.LightDirX:
                return view.getObj().getDirection().x;
            case LightViewControllerParam.LightDirY:
                return view.getObj().getDirection().y;
            case LightViewControllerParam.LightDirZ:
                return view.getObj().getDirection().z;    
        }
    }
}

export class LightAngleController extends PropController<string> {
    private registry: Registry;

    constructor(registry: Registry) {
        super(registry);
        this.registry = registry;
    }
    
    acceptedProps() { return [LightViewControllerParam.LightAngle]; }

    defaultVal(context: PropContext) {
        const lightView = <LightView> context.registry.data.view.scene.getOneSelectedView();

        return toDegree(lightView.getObj().getAngle());
    }

    change(val, context: PropContext) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    blur(context: PropContext) {
        const lightView = <LightView> context.registry.data.view.scene.getOneSelectedView();

        try {
            if (context.getTempVal() !== undefined && context.getTempVal() !== "") {
                const angle = context.getTempVal() || this.defaultVal(context);
                lightView.getObj().setAngle(angle);
            }
        } catch(e) {
            this.registry.services.error.setError(new ApplicationError(e));
        } finally {
            context.clearTempVal();
            context.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
        }
    }
}

export class LightDiffuseColorController extends PropController<string> {
    private registry: Registry;

    constructor(registry: Registry) {
        super(registry);
        this.registry = registry;
    }

    acceptedProps() { return [LightViewControllerParam.LightColorDiffuse]; }

    defaultVal(context: PropContext) {
        const lightView = <LightView> context.registry.data.view.scene.getOneSelectedView();

        return lightView.getObj().getDiffuseColor();
    }

    change(val, context: PropContext) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    blur(context: PropContext) {
        const lightView = <LightView> context.registry.data.view.scene.getOneSelectedView();

        try {
            if (context.getTempVal() !== undefined && context.getTempVal() !== "") {
                const color = context.getTempVal() || this.defaultVal(context);
                lightView.getObj().setDiffuseColor(color);
                context.registry.services.history.createSnapshot();
            }
        } catch(e) {
            this.registry.services.error.setError(new ApplicationError(e));
        } finally {
            context.clearTempVal();
            context.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
        }

    }
}

export class LightParentMeshController extends PropController<string> {
    acceptedProps() { return [LightViewControllerParam.LightParentMesh]; }

    values(context: PropContext) {
        return context.registry.data.view.scene.getViewsByType(MeshViewType).map(obj => obj.id)
    }

    defaultVal(context: PropContext) {
        const lightView = <LightView> context.registry.data.view.scene.getOneSelectedView();

        return lightView.getParent() && lightView.getParent().id;
    }

    change(val, context: PropContext) {
        const lightView = <LightView> context.registry.data.view.scene.getOneSelectedView();
        const meshView = <MeshView> context.registry.data.view.scene.getById(val);

        if (meshView) {
            lightView.setParent(meshView);
            context.registry.services.history.createSnapshot();
            context.registry.services.render.reRender(UI_Region.Sidepanel);
        }
    }
}