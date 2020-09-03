import { SpriteView } from '../../../core/models/views/SpriteView';
import { AbstractController, PropControl } from '../../../core/plugins/controllers/AbstractController';
import { UI_Plugin, UI_Region } from '../../../core/plugins/UI_Plugin';
import { Registry } from '../../../core/Registry';
import { SpriteSheetManagerDialogPluginId } from '../dialogs/SpritesheetManagerDialogPlugin';
import { Point } from '../../../utils/geometry/shapes/Point';

export enum SpriteSettingsProps {
    FrameName = 'FrameName',
    SpriteSheet = 'SpriteSheet',
    EditSpriteSheets = 'EditSpriteSheets',
    ScaleX = 'ScaleX',
    ScaleY = 'ScaleY',
}

export const SpriteSettingsControllerId = 'sprite-settings-controller';
export class SpriteSettingsController extends AbstractController<SpriteSettingsProps> {
    id = SpriteSettingsControllerId;
    spriteView: SpriteView;

    constructor(plugin: UI_Plugin, registry: Registry) {
        super(plugin, registry);

        this.createPropHandler<string>(SpriteSettingsProps.FrameName)
            .onChange((val, context) => {
                context.updateTempVal(val);
                this.registry.services.render.reRender(UI_Region.Sidepanel);
            })
            .onBlur((context) => {
                const spriteView = (<SpriteView> this.registry.stores.selectionStore.getView());
                context.releaseTempVal((val) => spriteView.obj.frameName = val);
                this.registry.services.history.createSnapshot();
                this.registry.engine.sprites.createInstance(spriteView.obj);
                this.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
            })
            .onGet((context) => (<SpriteView> this.registry.stores.selectionStore.getView()).obj.frameName);

        this.createPropHandler<string>(SpriteSettingsProps.SpriteSheet)
            .onChange((val, context) => {
                (<SpriteView> this.registry.stores.selectionStore.getView()).obj.spriteSheetId = val;
                this.registry.services.render.reRender(UI_Region.Sidepanel);
            })
            .onGet(() => {
                const spriteAssetId = (<SpriteView> this.registry.stores.selectionStore.getView()).obj.spriteSheetId;
                if (spriteAssetId) {
                    return this.registry.stores.assetStore.getAssetById(spriteAssetId).path;
                }
            })
            .onGetValues(() => this.registry.stores.spriteSheetObjStore.getAll().map(asset => asset.id));

            this.registerPropControl(SpriteSettingsProps.EditSpriteSheets, EditSpriteSheet);
            this.registerPropControl(SpriteSettingsProps.ScaleX, ScaleX);
            this.registerPropControl(SpriteSettingsProps.ScaleY, ScaleY);
    }
}

const EditSpriteSheet: PropControl<string> = {
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
        context.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
    }
}