import { AbstractController, PropControl } from '../../../core/plugins/controllers/AbstractController';
import { Registry } from '../../../core/Registry';
import { UI_Region } from '../../../core/plugins/UI_Plugin';
import { SpriteSheetManagerDialogPlugin } from './SpritesheetManagerDialogPlugin';
import { AssetObj, AssetType } from '../../../core/models/game_objects/AssetObj';
import { SpriteSheetObj } from '../../../core/models/game_objects/SpriteSheetObj';

export const SpritesheetManagerDialogControllerId = 'spritesheet-manager-dialog-controller';

export enum SpritesheetManagerDialogProps {
    UploadSpritesheetImg = 'UploadSpritesheetImg',
    UploadSpritesheetJson = 'UploadSpritesheetJson',
    AddSpriteSheet = 'AddSpriteSheet'
}

export class SpritesheetManagerDialogController extends AbstractController<{}> {
    id = SpritesheetManagerDialogControllerId;

    tmpImgAsset: AssetObj;
    tmpJsonAsset: AssetObj;

    constructor(plugin: SpriteSheetManagerDialogPlugin, registry: Registry) {
        super(plugin, registry);

        this.createPropHandler<{data: string, path: string}>(SpritesheetManagerDialogProps.UploadSpritesheetImg)
        .onChange((val) => {
            const asset = new AssetObj({data: val.data, path: val.path, assetType: AssetType.SpriteSheet});
            this.tmpImgAsset = asset;
            this.registry.services.render.reRender(UI_Region.Dialog);
        });

        this.createPropHandler<{data: string, path: string}>(SpritesheetManagerDialogProps.UploadSpritesheetJson)
        .onChange((val, context) => {
            const asset = new AssetObj({data: val.data, path: val.path, assetType: AssetType.SpriteSheetJson});
            this.tmpJsonAsset = asset;
            this.registry.services.render.reRender(UI_Region.Dialog);
        });

        this.registerPropControl(SpritesheetManagerDialogProps.AddSpriteSheet, AddSpriteSheet);
    }
}

const AddSpriteSheet: PropControl<string> = {

    click(context, element, controller: SpritesheetManagerDialogController) {
        const spriteSheetObj = new SpriteSheetObj();
        context.registry.stores.assetStore.addObj(controller.tmpImgAsset);
        context.registry.stores.assetStore.addObj(controller.tmpJsonAsset);
        spriteSheetObj.jsonAssetId = controller.tmpJsonAsset.id;
        spriteSheetObj.spriteAssetId = controller.tmpImgAsset.id;
        context.registry.stores.spriteSheetObjStore.addObj(spriteSheetObj);

        // this.registry.services.localStore.saveAsset(asset);

        controller.tmpImgAsset = undefined;
        controller.tmpJsonAsset = undefined;
        // const asset = new AssetObj({data: val.data, path: val.path, assetType: AssetType.SpriteSheetJson});
        // this.tmpJsonAsset = asset;
        // this.registry.stores.assetStore.addObj(asset);
        context.registry.engine.spriteLoader.loadSpriteSheet(spriteSheetObj);
        context.registry.services.history.createSnapshot();
        context.registry.services.render.reRender(UI_Region.Dialog);
    }
}