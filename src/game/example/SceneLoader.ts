import { AssetObj, AssetType } from "../../core/models/game_objects/AssetObj";
import { Registry } from "../../core/Registry";
import { SpriteObj } from "../../core/models/game_objects/SpriteObj";
import { Point } from "../../utils/geometry/shapes/Point";
import { SpriteView } from "../../core/models/views/SpriteView";

export interface SceneJson {
    sprites: {
        x: number;
        y: number;
        frameName: string;
        spriteSheetPath: string;
    }[];
}

export class SceneLoader {
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    load(sceneJson: SceneJson) {
        sceneJson.sprites.forEach(sprite => this.addSprite(sprite));
    }

    private addSprite(spriteJson: { x: number; y: number; frameName: string; spriteSheetPath: string; }) {
        let asset = this.registry.stores.assetStore.lookupByProp('path', spriteJson.spriteSheetPath) || this.addSpriteSheet(spriteJson);

        const spriteView = new SpriteView();
        spriteView.obj = new SpriteObj();

        spriteView.obj.frameName = spriteJson.frameName;
        spriteView.obj.startPos = new Point(spriteJson.x, spriteJson.y);
        spriteView.obj.spriteAssetId = asset.id;

        this.registry.stores.spriteStore.addItem(spriteView);
        this.registry.engine.spriteLoader.load(spriteView.obj);
        this.registry.engine.sprites.setPosition(spriteView.obj, new Point(spriteJson.x, spriteJson.y));
    }

    private addSpriteSheet(spriteJson: { x: number; y: number; frameName: string; spriteSheetPath: string; }): AssetObj {
        const assetObj = new AssetObj({path: spriteJson.spriteSheetPath, assetType: AssetType.SpriteSheet});
        this.registry.stores.assetStore.addObj(assetObj);

        return assetObj;
    }
}