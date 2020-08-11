import { AbstractPluginService } from '../../plugins/common/AbstractPluginService';
import { AbstractCanvasPlugin } from '../plugins/AbstractCanvasPlugin';
import { AssetModel } from '../stores/game_objects/AssetModel';

export class TextureLoaderService extends AbstractPluginService<AbstractCanvasPlugin> {
    static serviceName = 'texture-loader-service';
    serviceName = TextureLoaderService.serviceName;

    load(assetModel: AssetModel): Promise<string> {
        return this.registry.services.localStore.loadAsset(assetModel);
    }

    clear(): void {
    }
}