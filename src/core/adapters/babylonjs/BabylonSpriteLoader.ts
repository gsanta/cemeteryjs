import { SpriteObj } from "../../models/game_objects/SpriteObj";
import { ISpriteLoaderAdapter } from "../ISpriteLoaderAdapter";
import { Registry } from "../../Registry";
import { SpritePackedManager, Sprite } from "babylonjs";
import { BabylonEngineFacade } from "./BabylonEngineFacade";

export class BabylonSpriteLoader implements ISpriteLoaderAdapter {
    private registry: Registry;
    private managers: Map<string, SpritePackedManager> = new Map();
    sprites: Map<string, Sprite> = new Map();

    constructor(registry: Registry) {
        this.registry = registry;
    }

    load(spriteObj: SpriteObj) {
        const scene = (<BabylonEngineFacade> this.registry.engine).scene;
        const assetObj = this.registry.stores.assetStore.getAssetById(spriteObj.spriteAssetId);

        if (!this.managers.has(assetObj.path)) {
            this.managers.set(assetObj.path, new SpritePackedManager(assetObj.path, assetObj.path, 10, scene));
        }

        const sprite = new Sprite("sprite", this.managers.get(assetObj.path));
        sprite.cellRef = spriteObj.frameName;
        
        spriteObj.sprite = sprite;
        this.sprites.set(spriteObj.id, sprite);
    }
}