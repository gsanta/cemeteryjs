import { LightView } from '../../../../core/models/views/LightView';
import { PropContext, PropController } from '../../../../core/plugin/controller/FormController';
import { UI_Region } from '../../../../core/plugin/UI_Panel';
import { toDegree, toRadian } from '../../../../utils/geometry/Measurements';
import { Point_3 } from '../../../../utils/geometry/shapes/Point_3';

export enum LightSettingsProps {
    LightYPos = 'LightYPos',
    LightAngle = 'LightAngle'
}

export class LightYPosController extends PropController<string> {
    acceptedProps() { return [LightSettingsProps.LightYPos]; }

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

export class LightAngleController extends PropController<string> {
    acceptedProps() { return [LightSettingsProps.LightAngle]; }

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