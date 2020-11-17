import { CanvasAxis } from '../../../../core/models/misc/CanvasAxis';
import { LightView } from './LightView';
import { FormController, PropContext, PropController } from '../../../../core/plugin/controller/FormController';
import { UI_Region } from '../../../../core/plugin/UI_Panel';
import { toDegree, toRadian } from '../../../../utils/geometry/Measurements';
import { Point_3 } from '../../../../utils/geometry/shapes/Point_3';
import { MeshViewType } from './MeshView';
import { MeshObj } from '../../../../core/models/objs/MeshObj';

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

        const pos = lightView.getObj().getPosition();
        let yPos = pos.y;
        try {
            context.releaseTempVal(val => yPos = parseFloat(val))
        } catch(e) {
            console.log(e);
        }

        lightView.getObj().setPosition(new Point_3(pos.x, yPos, pos.z));
        context.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
    }
}

export class LightDirController extends PropController<string> {
    private prop: LightViewControllerParam;
    acceptedProps() { return [this.prop]; }

    constructor(axis: CanvasAxis) {
        super();
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

        const val = context.getTempVal() || this.defaultVal(context);
        this.setVal(lightView, val);
        context.clearTempVal();
        context.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
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

        let angle = lightView.getObj().getAngle();
        try {
            context.releaseTempVal(val => angle = toRadian(parseFloat(val)))
        } catch(e) {
            console.log(e);
        }

        lightView.getObj().setAngle(angle);
        context.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
    }
}

export class LightDiffuseColorController extends PropController<string> {
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

        let color: string;
        context.releaseTempVal(val => color = val || lightView.getObj().getDiffuseColor())

        lightView.getObj().setDiffuseColor(color);
        context.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
    }
}

export class LightParentMeshController extends PropController<string> {
    acceptedProps() { return [LightViewControllerParam.LightParentMesh]; }

    values(context: PropContext) {
        return context.registry.data.view.scene.getViewsByType(MeshViewType).map(meshView => meshView.id)
    }

    defaultVal(context: PropContext) {
        const lightView = <LightView> context.registry.data.view.scene.getOneSelectedView();

        return lightView.getObj().getParent() && lightView.getObj().getParent().id;
    }

    change(val, context: PropContext) {
        const lightView = <LightView> context.registry.data.view.scene.getOneSelectedView();
        const mesh = <MeshObj> context.registry.stores.objStore.getById(val);

        if (mesh) {
            lightView.getObj().setParent(mesh);
            context.registry.services.history.createSnapshot();
            context.registry.services.render.reRender(UI_Region.Canvas1);
        }
    }
}