import { SpriteView } from '../../../../core/models/views/SpriteView';
import { AbstractController, PropControl } from '../../../../core/plugins/controllers/AbstractController';
import { UI_Plugin, UI_Region } from '../../../../core/plugins/UI_Plugin';
import { Registry } from '../../../../core/Registry';
import { SpriteSheetManagerDialogPluginId } from '../../dialogs/SpritesheetManagerDialogPlugin';
import { Point } from '../../../../utils/geometry/shapes/Point';

export enum SpriteSettingsProps {
    FrameName = 'FrameName',
    SelectSpriteSheet = 'SpriteSheet',
    ManageSpriteSheets = 'EditSpriteSheets',
    ScaleX = 'ScaleX',
    ScaleY = 'ScaleY',
}

export const SpriteSettingsControllerId = 'sprite-settings-controller';
export class SpriteSettingsController extends AbstractController<SpriteSettingsProps> {
    id = SpriteSettingsControllerId;
    spriteView: SpriteView;

    constructor(plugin: UI_Plugin, registry: Registry) {
        super(plugin, registry);

        this.registerPropControl(SpriteSettingsProps.FrameName, FrameName);
        this.registerPropControl(SpriteSettingsProps.SelectSpriteSheet, SelectSpriteSheet);
        this.registerPropControl(SpriteSettingsProps.ManageSpriteSheets, ManageSpriteSheets);
        this.registerPropControl(SpriteSettingsProps.ScaleX, ScaleX);
        this.registerPropControl(SpriteSettingsProps.ScaleY, ScaleY);
    }
}

const FrameName: PropControl<string> = {
    defaultVal(context) {
        return (<SpriteView> context.registry.stores.selectionStore.getOneSelectedView()).obj.frameName || '';
    },

    change(val, context) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Sidepanel);
    },

    blur(context) {
        const spriteView = (<SpriteView> context.registry.stores.selectionStore.getOneSelectedView());
        context.releaseTempVal((val) => spriteView.obj.frameName = val);
        context.registry.services.history.createSnapshot();
        context.registry.engine.sprites.createInstance(spriteView.obj);
        context.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
    }
}

const SelectSpriteSheet: PropControl<string> = {
    defaultVal(context) {
        return (<SpriteView> context.registry.stores.selectionStore.getOneSelectedView()).obj.spriteSheetId;
    },

    change(val, context) {
        (<SpriteView> context.registry.stores.selectionStore.getOneSelectedView()).obj.spriteSheetId = val;
        context.registry.services.history.createSnapshot();
        context.registry.services.render.reRender(UI_Region.Sidepanel);
    },

    values(context) {
        return context.registry.stores.spriteSheetObjStore.getAll().map(asset => asset.id);
    }
}

const ManageSpriteSheets: PropControl<string> = {
    click(context) {
        context.registry.plugins.activatePlugin(SpriteSheetManagerDialogPluginId);
        context.registry.services.render.reRenderAll();
    }
}

const ScaleX: PropControl<string> = {
    defaultVal(context, element, controller: SpriteSettingsController) {
        return controller.spriteView.obj.getScale().x;
    },

    change(val, context) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Sidepanel);
    },

    blur(context, element, controller: SpriteSettingsController) {
        const currScale = controller.spriteView.obj.getScale();
        let scaleX = currScale.x;
        try {
            context.releaseTempVal(val => scaleX = parseFloat(val));
        } catch (e) {
            console.log(e);
        }
        controller.spriteView.obj.setScale(new Point(scaleX, currScale.y));
        context.registry.engine.sprites.updateInstance(controller.spriteView.obj);
        context.registry.services.history.createSnapshot();
        context.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
    }
}


const ScaleY: PropControl<string> = {
    defaultVal(context, element, controller: SpriteSettingsController) {
        return controller.spriteView.obj.getScale().y;
    },

    change(val, context) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Sidepanel);
    },

    blur(context, element, controller: SpriteSettingsController) {
        const currScale = controller.spriteView.obj.getScale();
        let scaleY = currScale.y;
        try {
            context.releaseTempVal(val => scaleY = parseFloat(val));
        } catch (e) {
            console.log(e);
        }
        controller.spriteView.obj.setScale(new Point(currScale.x, scaleY));
        context.registry.engine.sprites.updateInstance(controller.spriteView.obj);
        context.registry.services.history.createSnapshot();
        context.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
    }
}