import { Vector3 } from "babylonjs";
import { Point } from "../../../utils/geometry/shapes/Point";
import { SpriteObj } from "../../models/game_objects/SpriteObj";
import { Registry } from "../../Registry";
import { ISpriteAdapter } from "../ISpriteAdapter";
import { BabylonSpriteLoader } from "./BabylonSpriteLoader";


export class Babylon_SpriteAdapter implements ISpriteAdapter {
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    setPosition(spriteObj: SpriteObj, pos: Point): void {
        const sprite = (this.registry.engine.spriteLoader as BabylonSpriteLoader).sprites.get(spriteObj.id);
        sprite.position = new Vector3(pos.x, 0, pos.y);
    }
}