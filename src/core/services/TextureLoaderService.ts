import { AbstractPluginService } from '../plugins/AbstractPluginService';
import { AbstractCanvasPlugin } from '../plugins/AbstractCanvasPlugin';
import { AssetObj } from '../models/game_objects/AssetObj';

export class TextureLoaderService extends AbstractPluginService<AbstractCanvasPlugin> {
    static serviceName = 'texture-loader-service';
    serviceName = TextureLoaderService.serviceName;

    load(asset: AssetObj): Promise<string> {
        return this.registry.services.localStore.loadAsset(asset);
    }

    clear(): void {
    }
}