import { toDegree, toRadian } from '../../../utils/geometry/Measurements';
import { MeshView } from '../../../core/models/views/MeshView';
import { Registry } from '../../../core/Registry';
import { RenderTask } from '../../../core/services/RenderServices';
import { AbstractController } from '../../../core/plugins/controllers/AbstractController';
import { PathView } from '../../../core/models/views/PathView';
import { UI_Plugin, UI_Region } from '../../../core/plugins/UI_Plugin';
import { SpriteView } from '../../../core/models/views/SpriteView';
import { SpriteSheetManagerDialogPluginId } from '../dialogs/SpritesheetManagerDialogPlugin';
import { AssetType } from '../../../core/models/game_objects/AssetObj';

export enum SpriteSettingsProps {
    FrameName = 'FrameName',
    SpriteSheet = 'SpriteSheet',
    EditSpriteSheets = 'EditSpriteSheets'
}

export const SpriteSettingsControllerId = 'sprite-settings-controller';
export class SpriteSettingsController extends AbstractController<SpriteSettingsProps> {
    id = SpriteSettingsControllerId;
    pathView: PathView;

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
                this.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
            })
            .onGet((context) => (<SpriteView> this.registry.stores.selectionStore.getView()).obj.frameName);

        this.createPropHandler<string>(SpriteSettingsProps.SpriteSheet)
            .onChange((val, context) => {
                const spriteAsset = this.registry.stores.assetStore.lookupByProp('path', val);
                (<SpriteView> this.registry.stores.selectionStore.getView()).obj.spriteAssetId = spriteAsset.id;
                this.registry.services.render.reRender(UI_Region.Sidepanel);
            })
            .onGet(() => {
                const spriteAssetId = (<SpriteView> this.registry.stores.selectionStore.getView()).obj.spriteAssetId;
                if (spriteAssetId) {
                    return this.registry.stores.assetStore.getAssetById(spriteAssetId).path;
                }
            })
            .onGetValues(() => this.registry.stores.assetStore.getByType(AssetType.SpriteSheet).map(asset => asset.path));

        this.createPropHandler<string>(SpriteSettingsProps.EditSpriteSheets)
            .onClick((val, context) => {
                this.registry.plugins.activatePlugin(SpriteSheetManagerDialogPluginId);
                this.registry.services.render.reRenderAll();
            });
    }
}