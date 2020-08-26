import { SpriteObj } from "../../models/game_objects/SpriteObj";
import { ISpriteLoaderAdapter } from "../ISpriteLoaderAdapter";
import { Registry } from "../../Registry";
import { SpritePackedManager, Sprite } from "babylonjs";
import { Scene } from "babylonjs/scene";

export class SpriteLoaderAdapter implements ISpriteLoaderAdapter {
    private registry: Registry;
    private managers: Map<string, SpritePackedManager> = new Map();
    private scene: Scene;

    constructor(scene: Scene, registry: Registry) {
        this.scene = scene;
        this.registry = registry;
    }

    load(spriteObj: SpriteObj) {
        const assetObj = this.registry.stores.assetStore.getAssetById(spriteObj.spriteAssetId);

        if (!this.managers.has(assetObj.path)) {
            this.managers.set(assetObj.path, new SpritePackedManager(assetObj.path, assetObj.path, 10, this.scene));
        }

        const sprite = new Sprite("sprite", this.managers.get(assetObj.path));
        sprite.cellRef = spriteObj.frameName;

        spriteObj.sprite = sprite;
    }
}