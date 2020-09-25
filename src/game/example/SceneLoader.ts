import { AssetObj, AssetType } from "../../core/models/objs/AssetObj";
import { Registry } from "../../core/Registry";
import { SpriteObj } from "../../core/models/objs/SpriteObj";
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
        this.registry.stores.assetStore.lookupByProp('path', spriteJson.spriteSheetPath) || this.addSpriteSheet(spriteJson);

        const spriteView = new SpriteView();
        spriteView.setObj(new SpriteObj());
        spriteView.getObj().spriteAdapter = this.registry.engine.sprites;

        spriteView.getObj().frameName = spriteJson.frameName;
        spriteView.getObj().startPos = new Point(spriteJson.x, spriteJson.y);

        this.registry.stores.viewStore.addView(spriteView);
        this.registry.engine.sprites.createInstance(spriteView.getObj());
        this.registry.engine.sprites.setPosition(spriteView.getObj(), new Point(spriteJson.x, spriteJson.y));
    }

    private addSpriteSheet(spriteJson: { x: number; y: number; frameName: string; spriteSheetPath: string; }): AssetObj {
        const assetObj = new AssetObj({path: spriteJson.spriteSheetPath, assetType: AssetType.SpriteSheet});
        this.registry.stores.assetStore.addObj(assetObj);

        return assetObj;
    }
}