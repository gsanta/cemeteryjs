import { SpriteSheetObjType } from '../../../../core/models/objs/SpriteSheetObj';
import { SpriteView } from './SpriteView';
import { PropContext, PropController } from '../../../../core/plugin/controller/FormController';
import { UI_Region } from '../../../../core/plugin/UI_Panel';
import { Point } from '../../../../utils/geometry/shapes/Point';
import { SpriteSheetManagerDialogId } from '../../../dialog_plugins/spritesheet_manager/registerSpriteSheetManagerDialog';
import { ApplicationError } from '../../../../core/services/ErrorService';
import { Registry } from '../../../../core/Registry';

export enum SpriteViewControllerParam {
    FrameName = 'FrameName',
    SelectSpriteSheet = 'SpriteSheet',
    ManageSpriteSheets = 'EditSpriteSheets',
    ScaleX = 'ScaleX',
    ScaleY = 'ScaleY',
}

export class FrameName extends PropController<string> {
    acceptedProps() { return [SpriteViewControllerParam.FrameName]; }

    defaultVal(context: PropContext) {
        return (<SpriteView> context.registry.data.view.scene.getOneSelectedView()).getObj().frameName || '';
    }

    change(val, context: PropContext) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    blur(context: PropContext) {
        const spriteView = (<SpriteView> context.registry.data.view.scene.getOneSelectedView());
        context.releaseTempVal((val) => spriteView.getObj().frameName = val);
        context.registry.services.history.createSnapshot();
        context.registry.engine.sprites.updateInstance(spriteView.getObj());
        context.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
    }
}

export class SelectSpriteSheetController extends PropController<string> {
    acceptedProps() { return [SpriteViewControllerParam.SelectSpriteSheet]; }

    defaultVal(context: PropContext) {
        return (<SpriteView> context.registry.data.view.scene.getOneSelectedView()).getObj().spriteSheetId;
    }

    change(val, context: PropContext) {
        const spriteView = (<SpriteView> context.registry.data.view.scene.getOneSelectedView());
        spriteView.getObj().spriteSheetId = val;
        context.registry.services.history.createSnapshot();
        context.registry.engine.sprites.updateInstance(spriteView.getObj());
        context.registry.services.render.reRender(UI_Region.Sidepanel);
    }

    values(context: PropContext) {
        return context.registry.stores.objStore.getObjsByType(SpriteSheetObjType).map(asset => asset.id);
    }
}

export class ManageSpriteSheetsController extends PropController<string> {
    acceptedProps() { return [SpriteViewControllerParam.ManageSpriteSheets]; }

    click(context: PropContext) {
        const dialog = context.registry.ui.panel.getPanel(SpriteSheetManagerDialogId);
        context.registry.ui.helper.setDialogPanel(dialog);
        context.registry.services.render.reRenderAll();
    }
}

export class ScaleXController extends PropController<string> {
    private registry: Registry;

    constructor(registry: Registry) {
        super(registry);
        this.registry = registry;
    }

    acceptedProps() { return [SpriteViewControllerParam.ScaleX]; }

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

        try {
            if (context.getTempVal() !== undefined && context.getTempVal() !== "") {
                const scaleX = parseFloat(context.getTempVal());
                
                const currScale = spriteView.getObj().getScale();
                spriteView.getObj().setScale(new Point(scaleX, currScale.y))
                context.registry.engine.sprites.updateInstance(spriteView.getObj());
                context.registry.services.history.createSnapshot();
            }
        } catch(e) {
            this.registry.services.error.setError(new ApplicationError(e));
        } finally {
            context.clearTempVal();
        }
        
        context.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
    }
}


export class ScaleYController extends PropController<string> {
    private registry: Registry;

    constructor(registry: Registry) {
        super(registry);
        this.registry = registry;
    }

    acceptedProps() { return [SpriteViewControllerParam.ScaleY]; }

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

        try {
            if (context.getTempVal() !== undefined && context.getTempVal() !== "") {
                const scaleY = parseFloat(context.getTempVal());
                
                const currScale = spriteView.getObj().getScale();
                spriteView.getObj().setScale(new Point(currScale.x, scaleY))
                context.registry.engine.sprites.updateInstance(spriteView.getObj());
                context.registry.services.history.createSnapshot();
            }
        } catch(e) {
            this.registry.services.error.setError(new ApplicationError(e));
        } finally {
            context.clearTempVal();
        }

        context.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
    }
}