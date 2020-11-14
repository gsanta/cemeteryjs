import { CanvasAxis } from '../../../../core/models/misc/CanvasAxis';
import { LightView } from '../../../../core/models/views/LightView';
import { PropContext, PropController } from '../../../../core/plugin/controller/FormController';
import { UI_Region } from '../../../../core/plugin/UI_Panel';
import { toDegree, toRadian } from '../../../../utils/geometry/Measurements';
import { Point_3 } from '../../../../utils/geometry/shapes/Point_3';

export enum LightSettingsProp {
    LightYPos = 'light-y-pos',
    LightAngle = 'LightAngle',

    LightDirX = 'light-dir-x',
    LightDirY = 'light-dir-y',
    LightDirZ = 'light-dir-z'
}

export class LightYPosController extends PropController<string> {
    acceptedProps() { return [LightSettingsProp.LightYPos]; }

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
    private prop: LightSettingsProp;
    acceptedProps() { return [this.prop]; }

    constructor(axis: CanvasAxis) {
        super();
        switch(axis) {
            case CanvasAxis.X:
                this.prop = LightSettingsProp.LightDirX;
                break;
            case CanvasAxis.Y:
                this.prop = LightSettingsProp.LightDirY;
                break;
            case CanvasAxis.Z:
                this.prop = LightSettingsProp.LightDirZ;
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

        this.setVal(lightView, context.getTempVal());
        context.clearTempVal();
        context.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
    }

    private setVal(view: LightView, val: string) {
        const currPos = view.getObj().getDirection();

        let valNum;
        try {
            valNum = parseFloat(val);
        } catch(e) {
            console.log(e);
        }

        switch(this.prop) {
            case LightSettingsProp.LightDirX:
                return view.getObj().setDirection(new Point_3(valNum, currPos.y, currPos.z));
            case LightSettingsProp.LightDirY:
                return view.getObj().setDirection(new Point_3(currPos.x, valNum, currPos.z));
            case LightSettingsProp.LightDirY:
                return view.getObj().setDirection(new Point_3(currPos.x, currPos.y, valNum));    
        }
    }

    private getVal(view: LightView) {
        switch(this.prop) {
            case LightSettingsProp.LightDirX:
                return view.getObj().getDirection().x;
            case LightSettingsProp.LightDirY:
                return view.getObj().getDirection().y;
            case LightSettingsProp.LightDirY:
                return view.getObj().getDirection().z;    
        }
    }
}

export class LightAngleController extends PropController<string> {
    acceptedProps() { return [LightSettingsProp.LightAngle]; }

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