import { AssetObj, AssetType } from '../../../../core/models/objs/AssetObj';
import { SpriteSheetObj } from '../../../../core/models/objs/SpriteSheetObj';
import { PropContext, ParamController } from '../../../../core/controller/FormController';
import { UI_Panel, UI_Region } from '../../../../core/models/UI_Panel';
import { Registry } from '../../../../core/Registry';
import { UI_Element } from '../../../../core/ui_components/elements/UI_Element';
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

export class SpriteSheetJsonPathControl extends ParamController<{data: string, path: string}> {
    private uiPanel: UI_Panel;

    constructor(registry: Registry, uiPanel: UI_Panel) {
        super(registry);
        this.uiPanel = uiPanel;
    }

    acceptedProps() { return [SpritesheetManagerDialogProps.SpriteSheetJson]; }

    change(val: {data: string, path: string}, context: PropContext, element: UI_Element) {
        const json = atob(val.data.split(',')[1]);

        this.uiPanel.map.set(DataKeys.SpriteSheetJson, json);
        context.registry.services.render.reRender(UI_Region.Dialog);
    }
}

export class SpriteSheetImgController extends ParamController<string> {
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
        this.uiPanel.map.set(DataKeys.SpriteSheetImgUrl, context.getTempVal());
        context.registry.services.render.reRender(UI_Region.Dialog);
    }
}

export class AddSpriteSheetController extends ParamController<string> {
    private uiPanel: UI_Panel;

    constructor(registry: Registry, uiPanel: UI_Panel) {
        super(registry);
        this.uiPanel = uiPanel;
    }

    acceptedProps() { return [SpritesheetManagerDialogProps.AddSpriteSheet]; }

    click(context: PropContext) {
        const spriteSheetObj = new SpriteSheetObj();

        const spriteSheetJson = this.uiPanel.map.get(DataKeys.SpriteSheetJson);
        const imgPath = this.uiPanel.map.get(DataKeys.SpriteSheetImgUrl);
        
        const imgAsset = new AssetObj({path: imgPath, assetType: AssetType.SpriteSheet});
        const jsonAsset = new AssetObj({data: spriteSheetJson, assetType: AssetType.SpriteSheetJson});

        context.registry.stores.assetStore.addObj(imgAsset);
        context.registry.stores.assetStore.addObj(jsonAsset);

        context.registry.services.localStore.saveAsset(imgAsset);
        context.registry.services.localStore.saveAsset(jsonAsset);

        spriteSheetObj.jsonAssetId = jsonAsset.id;
        spriteSheetObj.spriteAssetId = imgAsset.id;
        context.registry.data.scene.items.addItem(spriteSheetObj);

        context.registry.engine.spriteLoader.loadSpriteSheet(spriteSheetObj);
        context.registry.services.history.createSnapshot();
        context.registry.services.render.reRender(UI_Region.Dialog);

        this.uiPanel.map.delete(DataKeys.SpriteSheetJson);
        this.uiPanel.map.delete(DataKeys.SpriteSheetImgUrl);
    }
}