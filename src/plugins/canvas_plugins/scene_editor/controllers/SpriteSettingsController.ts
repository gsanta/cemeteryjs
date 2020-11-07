import { SpriteSheetObjType } from '../../../../core/models/objs/SpriteSheetObj';
import { SpriteView } from '../../../../core/models/views/SpriteView';
import { PropContext, PropController } from '../../../../core/plugin/controller/FormController';
import { UI_Region } from '../../../../core/plugin/UI_Panel';
import { Point } from '../../../../utils/geometry/shapes/Point';
import { SpriteSheetManagerDialogId } from '../../../dialog_plugins/spritesheet_manager/registerSpriteSheetManagerDialog';

export enum SpriteSettingsProps {
    FrameName = 'FrameName',
    SelectSpriteSheet = 'SpriteSheet',
    ManageSpriteSheets = 'EditSpriteSheets',
    ScaleX = 'ScaleX',
    ScaleY = 'ScaleY',
}

export class FrameName extends PropController<string> {
    acceptedProps() { return [SpriteSettingsProps.FrameName]; }

    defaultVal(context) {
        return (<SpriteView> context.registry.stores.views.getOneSelectedView()).getObj().frameName || '';
    }

    change(val, context) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    blur(context) {
        const spriteView = (<SpriteView> context.registry.stores.views.getOneSelectedView());
        context.releaseTempVal((val) => spriteView.getObj().frameName = val);
        context.registry.services.history.createSnapshot();
        context.registry.engine.sprites.updateInstance(spriteView.getObj());
        context.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
    }
}

export class SelectSpriteSheetController extends PropController<string> {
    acceptedProps() { return [SpriteSettingsProps.SelectSpriteSheet]; }

    defaultVal(context) {
        return (<SpriteView> context.registry.stores.views.getOneSelectedView()).getObj().spriteSheetId;
    }

    change(val, context) {
        const spriteView = (<SpriteView> context.registry.stores.views.getOneSelectedView());
        spriteView.getObj().spriteSheetId = val;
        context.registry.services.history.createSnapshot();
        context.registry.engine.sprites.updateInstance(spriteView.getObj());
        context.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    values(context) {
        return context.registry.stores.objStore.getObjsByType(SpriteSheetObjType).map(asset => asset.id);
    }
}

export class ManageSpriteSheetsController extends PropController<string> {
    acceptedProps() { return [SpriteSettingsProps.ManageSpriteSheets]; }

    click(context: PropContext) {
        const dialog = context.registry.ui.panel.getPanel(SpriteSheetManagerDialogId);
        context.registry.ui.helper.setDialogPanel(dialog);
        context.registry.services.render.reRenderAll();
    }
}

export class ScaleXController extends PropController<string> {
    acceptedProps() { return [SpriteSettingsProps.ScaleX]; }

    defaultVal(context: PropContext) {
        const spriteView = <SpriteView> context.registry.data.view.scene.getOneSelectedView();

        return spriteView.getObj().getScale().x;
    }

    change(val, context: PropContext) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    blur(context: PropContext) {
        const spriteView = <SpriteView> context.registry.data.view.scene.getOneSelectedView();

        const currScale = spriteView.getObj().getScale();
        let scaleX = currScale.x;
        try {
            context.releaseTempVal(val => scaleX = parseFloat(val));
        } catch (e) {
            console.log(e);
        }
        spriteView.getObj().setScale(new Point(scaleX, currScale.y));
        context.registry.engine.sprites.updateInstance(spriteView.getObj());
        context.registry.services.history.createSnapshot();
        context.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
    }
}


export class ScaleYController extends PropController<string> {
    acceptedProps() { return [SpriteSettingsProps.ScaleY]; }

    defaultVal(context: PropContext) {
        const spriteView = <SpriteView> context.registry.data.view.scene.getOneSelectedView();

        return spriteView.getObj().getScale().y;
    }

    change(val, context: PropContext) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    blur(context: PropContext) {
        const spriteView = <SpriteView> context.registry.data.view.scene.getOneSelectedView();

        const currScale = spriteView.getObj().getScale();
        let scaleY = currScale.y;
        try {
            context.releaseTempVal(val => scaleY = parseFloat(val));
        } catch (e) {
            console.log(e);
        }
        spriteView.getObj().setScale(new Point(currScale.x, scaleY));
        context.registry.engine.sprites.updateInstance(spriteView.getObj());
        context.registry.services.history.createSnapshot();
        context.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
    }
}