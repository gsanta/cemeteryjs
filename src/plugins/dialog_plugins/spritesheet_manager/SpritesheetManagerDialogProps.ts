import { FormController, PropContext, PropController } from '../../../core/plugin/controller/FormController';
import { Registry } from '../../../core/Registry';
import { UI_Region } from '../../../core/plugin/UI_Plugin';
import { SpriteSheetManagerDialogPlugin } from './SpritesheetManagerDialogPlugin';
import { AssetObj, AssetType } from '../../../core/models/objs/AssetObj';
import { SpriteSheetObj } from '../../../core/models/objs/SpriteSheetObj';

export const SpritesheetManagerDialogControllerId = 'spritesheet-manager-dialog-controller';

export enum SpritesheetManagerDialogProps {
    SpriteSheetImg = 'UploadSpritesheetImg',
    SpriteSheetJson = 'UploadSpritesheetJson',
    AddSpriteSheet = 'AddSpriteSheet'
}

export class SpritesheetManagerDialogController extends FormController {
    id = SpritesheetManagerDialogControllerId;

    imgPath: string;
    jsonData: string;
    jsonPath: string;

    constructor(plugin: SpriteSheetManagerDialogPlugin, registry: Registry) {
        super(plugin, registry);

        this.registerPropControl(SpritesheetManagerDialogProps.SpriteSheetImg, SpriteSheetImgController);
        this.registerPropControl(SpritesheetManagerDialogProps.SpriteSheetJson, SpriteSheetJsonPathControl);
        this.registerPropControl(SpritesheetManagerDialogProps.AddSpriteSheet, AddSpriteSheetController);
    }
}

const SpriteSheetJsonPathControl: PropController<{data: string, path: string}> = {
    change(val: {data: string, path: string}, context, element, controller: SpritesheetManagerDialogController) {
        const json = atob(val.data.split(',')[1]);
        controller.jsonData = json;
        controller.jsonPath = val.path;
        context.registry.services.render.reRender(UI_Region.Dialog);
    },
}

export class SpriteSheetImgController extends PropController<string> {
    constructor() {
        super(SpritesheetManagerDialogProps.SpriteSheetImg);
    }

    defaultVal(context: PropContext, element, controller: SpritesheetManagerDialogController) {
        context.registry.plugins.getPropController(context.plugin.id).getPropContext()
        return controller.imgPath;
    }

    change(val: string, context) {
        context.updateTempVal(val);
        
        context.registry.services.render.reRender(UI_Region.Dialog);
    }

    blur(context, element, controller: SpritesheetManagerDialogController) {
        controller.imgPath = context.getTempVal();
        context.clearTempVal();

        context.registry.services.render.reRender(UI_Region.Dialog);
    }
}

export class AddSpriteSheetController extends PropController<string> {
    constructor() {
        super(SpritesheetManagerDialogProps.AddSpriteSheet);
    }

    click(context, element, controller: SpritesheetManagerDialogController) {
        const spriteSheetObj = new SpriteSheetObj();

        const imgAsset = new AssetObj({path: controller.imgPath, assetType: AssetType.SpriteSheet});
        const jsonAsset = new AssetObj({data: controller.jsonData, assetType: AssetType.SpriteSheetJson});

        context.registry.stores.assetStore.addObj(imgAsset);
        context.registry.stores.assetStore.addObj(jsonAsset);

        context.registry.services.localStore.saveAsset(imgAsset);
        context.registry.services.localStore.saveAsset(jsonAsset);

        spriteSheetObj.jsonAssetId = jsonAsset.id;
        spriteSheetObj.spriteAssetId = imgAsset.id;
        context.registry.stores.objStore.addObj(spriteSheetObj);

        // this.registry.services.localStore.saveAsset(asset);

        controller.imgPath = undefined;
        controller.jsonData = undefined;
        controller.jsonPath = undefined;
        // const asset = new AssetObj({data: val.data, path: val.path, assetType: AssetType.SpriteSheetJson});
        // this.tmpJsonAsset = asset;
        // this.registry.stores.assetStore.addObj(asset);
        context.registry.engine.spriteLoader.loadSpriteSheet(spriteSheetObj);
        context.registry.services.history.createSnapshot();
        context.registry.services.render.reRender(UI_Region.Dialog);
    }
}