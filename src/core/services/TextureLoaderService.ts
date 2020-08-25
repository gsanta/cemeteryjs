import { AbstractPluginService } from '../plugins/AbstractPluginService';
import { AbstractCanvasPlugin } from '../plugins/AbstractCanvasPlugin';
import { AssetObject } from '../models/game_objects/AssetObject';

export class TextureLoaderService extends AbstractPluginService<AbstractCanvasPlugin> {
    static serviceName = 'texture-loader-service';
    serviceName = TextureLoaderService.serviceName;

    load(asset: AssetObject): Promise<string> {
        return this.registry.services.localStore.loadAsset(asset);
    }

    clear(): void {
    }
}