import { AssetObj, AssetType } from '../../../core/models/objs/AssetObj';
import { SpriteSheetObj } from '../../../core/models/objs/SpriteSheetObj';
import { PropContext, PropController } from '../../../core/plugin/controller/FormController';
import { UI_Region } from '../../../core/plugin/UI_Panel';
import { SpriteSheetManagerDialogPlugin } from './SpritesheetManagerDialogPlugin';

export const SpritesheetManagerDialogControllerId = 'spritesheet-manager-dialog-controller';

export enum SpritesheetManagerDialogProps {
    SpriteSheetImg = 'UploadSpritesheetImg',
    SpriteSheetJson = 'UploadSpritesheetJson',
    AddSpriteSheet = 'AddSpriteSheet'
}

export class SpriteSheetJsonPathControl extends PropController<{data: string, path: string}> {
    acceptedProps() { return [SpritesheetManagerDialogProps.SpriteSheetJson]; }

    change(val: {data: string, path: string}, context: PropContext) {
        const json = atob(val.data.split(',')[1]);
        (<SpriteSheetManagerDialogPlugin> context.panel).tempSpriteSheetJson = json;
        context.registry.services.render.reRender(UI_Region.Dialog);
    }
}

export class SpriteSheetImgController extends PropController<string> {
    acceptedProps() { return [SpritesheetManagerDialogProps.SpriteSheetImg]; }

    defaultVal(context: PropContext) {
        return context.getTempVal();
    }

    change(val: string, context) {
        context.updateTempVal(val);
        
        context.registry.services.render.reRender(UI_Region.Dialog);
    }

    blur(context: PropContext) {
        (<SpriteSheetManagerDialogPlugin> context.panel).tempImagePath = context.getTempVal();
        context.registry.services.render.reRender(UI_Region.Dialog);
    }
}

export class AddSpriteSheetController extends PropController<string> {
    acceptedProps() { return [SpritesheetManagerDialogProps.AddSpriteSheet]; }

    click(context: PropContext) {
        const spriteSheetObj = new SpriteSheetObj();
        const plugin = (<SpriteSheetManagerDialogPlugin> context.panel);

        const spriteSheetJson = plugin.tempSpriteSheetJson;
        const imgPath = plugin.tempImagePath;
        
        const imgAsset = new AssetObj({path: imgPath, assetType: AssetType.SpriteSheet});
        const jsonAsset = new AssetObj({data: spriteSheetJson, assetType: AssetType.SpriteSheetJson});

        context.registry.stores.assetStore.addObj(imgAsset);
        context.registry.stores.assetStore.addObj(jsonAsset);

        context.registry.services.localStore.saveAsset(imgAsset);
        context.registry.services.localStore.saveAsset(jsonAsset);

        spriteSheetObj.jsonAssetId = jsonAsset.id;
        spriteSheetObj.spriteAssetId = imgAsset.id;
        context.registry.stores.objStore.addObj(spriteSheetObj);

        context.registry.engine.spriteLoader.loadSpriteSheet(spriteSheetObj);
        context.registry.services.history.createSnapshot();
        context.registry.services.render.reRender(UI_Region.Dialog);

        plugin.tempSpriteSheetJson = undefined;
        plugin.tempImagePath = undefined;
    }
}