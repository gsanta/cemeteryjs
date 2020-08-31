import { SpriteObj } from "../../models/game_objects/SpriteObj";
import { ISpriteLoaderAdapter } from "../ISpriteLoaderAdapter";
import { Registry } from "../../Registry";
import { SpritePackedManager, Sprite } from "babylonjs";
import { BabylonEngineFacade } from "./BabylonEngineFacade";
import { AssetObj, AssetType } from "../../models/game_objects/AssetObj";

export class BabylonSpriteLoader implements ISpriteLoaderAdapter {
    private registry: Registry;
    private managers: Map<string, SpritePackedManager> = new Map();
    sprites: Map<string, Sprite> = new Map();

    constructor(registry: Registry) {
        this.registry = registry;
    }

    loadSpriteSheet(assetObj: AssetObj) {
        // if (assetObj.assetType !== AssetType.SpriteSheet) {
        //     throw new Error(`Can not load spritesheet, because asset type is not ${AssetType.SpriteSheet} but ${assetObj.assetType}`);
        // }

        // if (!this.managers.has(assetObj.path)) {
        //     const scene = (<BabylonEngineFacade> this.registry.engine).scene;
        //     this.managers.set(assetObj.path, new SpritePackedManager(assetObj.path, assetObj.path, 10, scene));
        // }
    }

    load(spriteObj: SpriteObj) {
        const assetObj = this.registry.stores.assetStore.getAssetById(spriteObj.spriteAssetId);

        const sprite = new Sprite("sprite", this.managers.get(assetObj.path));
        sprite.cellRef = spriteObj.frameName;
        
        spriteObj.sprite = sprite;
        this.sprites.set(spriteObj.id, sprite);
    }
}