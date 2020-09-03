import { Sprite, SpritePackedManager, Vector3 } from "babylonjs";
import { SpriteObj } from "../../models/game_objects/SpriteObj";
import { SpriteSheetObj } from "../../models/game_objects/SpriteSheetObj";
import { Registry } from "../../Registry";
import { ISpriteLoaderAdapter } from "../ISpriteLoaderAdapter";
import { BabylonEngineFacade } from "./BabylonEngineFacade";

export class BabylonSpriteLoader implements ISpriteLoaderAdapter {
    private registry: Registry;
    managers: Map<string, SpritePackedManager> = new Map();

    constructor(registry: Registry) {
        this.registry = registry;
    }

    loadSpriteSheet(spriteSheetObj: SpriteSheetObj) {
        const imgAsset = this.registry.stores.assetStore.getAssetById(spriteSheetObj.spriteAssetId);
        const jsonAsset = this.registry.stores.assetStore.getAssetById(spriteSheetObj.jsonAssetId);

        if (!this.managers.has(spriteSheetObj.id)) {
            const scene = (<BabylonEngineFacade> this.registry.engine).scene;
            const json = atob(jsonAsset.data.split(',')[1]);
            this.managers.set(spriteSheetObj.id, new SpritePackedManager(imgAsset.data, imgAsset.data, 10, scene, json));
        }
    }
}