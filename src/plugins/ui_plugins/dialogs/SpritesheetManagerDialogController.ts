import { AbstractController } from '../../../core/plugins/controllers/AbstractController';
import { Registry } from '../../../core/Registry';
import { UI_Region } from '../../../core/plugins/UI_Plugin';
import { SpriteSheetManagerDialogPlugin } from './SpritesheetManagerDialogPlugin';
import { AssetObj, AssetType } from '../../../core/models/game_objects/AssetObj';

export const SpritesheetManagerDialogControllerId = 'spritesheet-manager-dialog-controller';

export enum SpritesheetManagerDialogProps {
    UploadSpritesheet = 'UploadSpritesheet',
    UploadSpritesheetJson = 'UploadSpritesheetJson',
}

export class SpritesheetManagerDialogController extends AbstractController<{}> {
    id = SpritesheetManagerDialogControllerId;

    constructor(plugin: SpriteSheetManagerDialogPlugin, registry: Registry) {
        super(plugin, registry);

        this.createPropHandler<{data: string, path: string}>(SpritesheetManagerDialogProps.UploadSpritesheet)
        .onChange((val) => {
            const asset = new AssetObj({data: val.data, path: val.path, assetType: AssetType.SpriteSheet});
            this.registry.stores.assetStore.addObj(asset);
            this.registry.services.localStore.saveAsset(asset);
            this.registry.engine.spriteLoader.loadSpriteSheet(asset);
            this.registry.services.history.createSnapshot();
            this.registry.services.render.reRender(UI_Region.Dialog);
        });

        this.createPropHandler<{data: string, path: string}>(SpritesheetManagerDialogProps.UploadSpritesheetJson)
        .onChange((val) => {
            const asset = new AssetObj({data: val.data, path: val.path, assetType: AssetType.SpriteSheetJson});
            this.registry.stores.assetStore.addObj(asset);
            this.registry.services.localStore.saveAsset(asset);
            this.registry.engine.spriteLoader.loadSpriteSheet(asset);
            this.registry.services.history.createSnapshot();
            this.registry.services.render.reRender(UI_Region.Dialog);
        });
    }
}