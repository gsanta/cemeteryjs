import { AssetObj, AssetType } from '../../../core/models/objs/AssetObj';
import { SpriteSheetObj } from '../../../core/models/objs/SpriteSheetObj';
import { PropContext, PropController } from '../../../core/plugin/controller/FormController';
import { UI_Region } from '../../../core/plugin/UI_Plugin';

export const SpritesheetManagerDialogControllerId = 'spritesheet-manager-dialog-controller';

export enum SpritesheetManagerDialogProps {
    SpriteSheetImg = 'UploadSpritesheetImg',
    SpriteSheetJson = 'UploadSpritesheetJson',
    AddSpriteSheet = 'AddSpriteSheet'
}

export class SpriteSheetJsonPathControl extends PropController<{data: string, path: string}> {

    constructor() {
        super(SpritesheetManagerDialogProps.SpriteSheetJson);
    }


    change(val: {data: string, path: string}, context: PropContext) {
        const json = atob(val.data.split(',')[1]);
        context.updateTempVal(json);
        context.registry.services.render.reRender(UI_Region.Dialog);
    }
}

export class SpriteSheetImgController extends PropController<string> {
    constructor() {
        super(SpritesheetManagerDialogProps.SpriteSheetImg);
    }

    defaultVal(context: PropContext) {
        return context.getTempVal();
    }

    change(val: string, context) {
        context.updateTempVal(val);
        
        context.registry.services.render.reRender(UI_Region.Dialog);
    }

    blur(context: PropContext) {
        context.registry.services.render.reRender(UI_Region.Dialog);
    }
}

export class AddSpriteSheetController extends PropController<string> {
    constructor() {
        super(SpritesheetManagerDialogProps.AddSpriteSheet);
    }

    click(context: PropContext) {
        const spriteSheetObj = new SpriteSheetObj();

        const controller = context.registry.plugins.getPropController(context.plugin.id);
        const jsonData = <string> controller.getPropContext(SpritesheetManagerDialogProps.SpriteSheetJson).getTempVal();
        controller.getPropContext(SpritesheetManagerDialogProps.SpriteSheetJson).clearTempVal();

        const imgPath = <string> controller.getPropContext(SpritesheetManagerDialogProps.SpriteSheetImg).getTempVal();
        controller.getPropContext(SpritesheetManagerDialogProps.SpriteSheetImg).clearTempVal();

        
        const imgAsset = new AssetObj({path: imgPath, assetType: AssetType.SpriteSheet});
        const jsonAsset = new AssetObj({data: jsonData, assetType: AssetType.SpriteSheetJson});

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
    }
}