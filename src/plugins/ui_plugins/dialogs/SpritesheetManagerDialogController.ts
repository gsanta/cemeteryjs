import { AbstractController } from '../../../core/plugins/controllers/AbstractController';
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

        this.createPropHandler(SpritesheetManagerDialogProps.AddSpriteSheet)
        .onClick((val, context) => {
            const spriteSheetObj = new SpriteSheetObj();
            this.registry.stores.assetStore.addObj(this.tmpImgAsset);
            this.registry.stores.assetStore.addObj(this.tmpJsonAsset);
            spriteSheetObj.jsonAssetId = this.tmpJsonAsset.id;
            spriteSheetObj.spriteAssetId = this.tmpImgAsset.id;
            this.registry.stores.spriteSheetObjStore.addObj(spriteSheetObj);

            this.tmpImgAsset = undefined;
            this.tmpJsonAsset = undefined;
            // const asset = new AssetObj({data: val.data, path: val.path, assetType: AssetType.SpriteSheetJson});
            // this.tmpJsonAsset = asset;
            // this.registry.stores.assetStore.addObj(asset);
            // this.registry.services.localStore.saveAsset(asset);
            // this.registry.engine.spriteLoader.loadSpriteSheet(asset);
            // this.registry.services.history.createSnapshot();
            this.registry.services.render.reRender(UI_Region.Dialog);
        });
    }
}