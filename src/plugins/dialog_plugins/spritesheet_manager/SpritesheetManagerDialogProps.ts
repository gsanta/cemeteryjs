import { AssetObj, AssetType } from '../../../core/models/objs/AssetObj';
import { SpriteSheetObj } from '../../../core/models/objs/SpriteSheetObj';
import { PropContext, PropController } from '../../../core/plugin/controller/FormController';
import { UI_Panel, UI_Region } from '../../../core/plugin/UI_Panel';
import { Registry } from '../../../core/Registry';
import { UI_Element } from '../../../core/ui_components/elements/UI_Element';
import { SpriteSheetManagerDialogRenderer } from './SpriteSheetManagerDialogRenderer';

export const SpritesheetManagerDialogControllerId = 'spritesheet-manager-dialog-controller';

export enum SpritesheetManagerDialogProps {
    SpriteSheetImg = 'UploadSpritesheetImg',
    SpriteSheetJson = 'UploadSpritesheetJson',
    AddSpriteSheet = 'AddSpriteSheet'
}

enum DataKeys {
    SpriteSheetJson = 'SpriteSheetJson',
    SpriteSheetImgUrl = 'SpriteSheetImgUrl'
}

export class SpriteSheetJsonPathControl extends PropController<{data: string, path: string}> {
    private uiPanel: UI_Panel;

    constructor(registry: Registry, uiPanel: UI_Panel) {
        super(registry);
        this.uiPanel = uiPanel;
    }

    acceptedProps() { return [SpritesheetManagerDialogProps.SpriteSheetJson]; }

    change(val: {data: string, path: string}, context: PropContext, element: UI_Element) {
        const json = atob(val.data.split(',')[1]);

        this.uiPanel.data.set(DataKeys.SpriteSheetJson, json);
        context.registry.services.render.reRender(UI_Region.Dialog);
    }
}

export class SpriteSheetImgController extends PropController<string> {
    private uiPanel: UI_Panel;

    constructor(registry: Registry, uiPanel: UI_Panel) {
        super(registry);
        this.uiPanel = uiPanel;
    }

    acceptedProps() { return [SpritesheetManagerDialogProps.SpriteSheetImg]; }

    defaultVal(context: PropContext) {
        return context.getTempVal();
    }

    change(val: string, context) {
        context.updateTempVal(val);
        1
        context.registry.services.render.reRender(UI_Region.Dialog);
    }

    blur(context: PropContext, element: UI_Element) {
        this.uiPanel.data.set(DataKeys.SpriteSheetImgUrl, context.getTempVal());
        context.registry.services.render.reRender(UI_Region.Dialog);
    }
}

export class AddSpriteSheetController extends PropController<string> {
    private uiPanel: UI_Panel;

    constructor(registry: Registry, uiPanel: UI_Panel) {
        super(registry);
        this.uiPanel = uiPanel;
    }

    acceptedProps() { return [SpritesheetManagerDialogProps.AddSpriteSheet]; }

    click(context: PropContext) {
        const spriteSheetObj = new SpriteSheetObj();

        const spriteSheetJson = this.uiPanel.data.get(DataKeys.SpriteSheetJson);
        const imgPath = this.uiPanel.data.get(DataKeys.SpriteSheetImgUrl);
        
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

        this.uiPanel.data.delete(DataKeys.SpriteSheetJson);
        this.uiPanel.data.delete(DataKeys.SpriteSheetImgUrl);
    }
}