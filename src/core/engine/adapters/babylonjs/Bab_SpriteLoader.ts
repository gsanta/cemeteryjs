import { SpritePackedManager } from "babylonjs";
import { SpriteSheetObj } from "../../../models/objs/SpriteSheetObj";
import { Registry } from "../../../Registry";
import { ISpriteLoaderAdapter } from "../../ISpriteLoaderAdapter";
import { Bab_EngineFacade } from "./Bab_EngineFacade";

export class Bab_SpriteLoader implements ISpriteLoaderAdapter {
    private registry: Registry;
    managers: Map<string, SpritePackedManager> = new Map();

    private engineFacade: Bab_EngineFacade;

    constructor(registry: Registry, engineFacade: Bab_EngineFacade) {
        this.registry = registry;
        this.engineFacade = engineFacade;
    }

    loadSpriteSheet(spriteSheetObj: SpriteSheetObj) {
        const imgAsset = this.registry.stores.assetStore.getAssetById(spriteSheetObj.spriteAssetId);
        const jsonAsset = this.registry.stores.assetStore.getAssetById(spriteSheetObj.jsonAssetId);

        if (!this.managers.has(spriteSheetObj.id)) {
            const scene = this.engineFacade.scene;
            this.managers.set(spriteSheetObj.id, new SpritePackedManager(imgAsset.id, imgAsset.path, 10, scene, jsonAsset.data));
        }
    }
}