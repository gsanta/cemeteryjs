import { LightView } from '../../../../core/models/views/LightView';
import { PropContext, PropController } from '../../../../core/plugin/controller/FormController';
import { UI_Region } from '../../../../core/plugin/UI_Panel';
import { Point_3 } from '../../../../utils/geometry/shapes/Point_3';

export enum LightSettingsProps {
    LightYPos = 'LightYPos'
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