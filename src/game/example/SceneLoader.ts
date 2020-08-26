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
        this.addSpriteSheets(sceneJson);
        this.addSprites(sceneJson);
    }

    private addSpriteSheets(sceneJson: SceneJson) {
        const spriteSheets: Set<string> = new Set();

        sceneJson.sprites.forEach(sprite => spriteSheets.add(sprite.spriteSheetPath));

        Array.from(spriteSheets)
            .map(path => new AssetObj({path, assetType: AssetType.SpriteSheet}))
            .forEach(assetObj => this.registry.stores.assetStore.addObj(assetObj));
    }

    private addSprites(sceneJson: SceneJson) {
        sceneJson.sprites.forEach(sprite => {
            const spriteView = new SpriteView();
            spriteView.obj = new SpriteObj();

            spriteView.obj.frameName = sprite.frameName;
            spriteView.obj.startPos = new Point(sprite.x, sprite.y);

            this.registry.stores.spriteStore.addItem(spriteView);
        });
    }
}