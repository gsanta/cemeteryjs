import { Sprite, Vector3 } from "babylonjs";
import { Point } from "../../../utils/geometry/shapes/Point";
import { SpriteObj } from "../../models/game_objects/SpriteObj";
import { Registry } from "../../Registry";
import { ISpriteAdapter } from "../ISpriteAdapter";
import { Bab_EngineFacade } from "./Bab_EngineFacade";

export class Bab_Sprites implements ISpriteAdapter {
    private registry: Registry;
    private engineFacade: Bab_EngineFacade;
    sprites: Map<string, Sprite> = new Map();

    constructor(registry: Registry, engineFacade: Bab_EngineFacade) {
        this.registry = registry;
        this.engineFacade = engineFacade;
    }

    setPosition(spriteObj: SpriteObj, pos: Point): void {
        const sprite = this.sprites.get(spriteObj.id);
        sprite.position = new Vector3(pos.x, 0, pos.y);
    }

    getPosition(spriteObj: SpriteObj): Point {
        const sprite = this.sprites.get(spriteObj.id);

        return  new Point(sprite.position.x, sprite.position.z);
    }

    setScale(spriteObj: SpriteObj, scale: Point): void {
        const sprite = this.sprites.get(spriteObj.id);
        if (!sprite) { return; }
        
        sprite.width = scale.x;
        sprite.height = scale.y;
    }

    updateInstance(spriteObj: SpriteObj): void {
        this.sprites.get(spriteObj.id).dispose();
        this.createInstance(spriteObj);
    }

    createInstance(spriteObj: SpriteObj) {
        const spriteSheetObj = this.registry.stores.spriteSheetObjStore.getById(spriteObj.spriteSheetId);

        const sprite = new Sprite("sprite", this.engineFacade.spriteLoader.managers.get(spriteSheetObj.id));
        sprite.width = spriteObj.getScale().x;
        sprite.height = spriteObj.getScale().y;
        sprite.cellRef = spriteObj.frameName;

        sprite.position = new Vector3(spriteObj.startPos.x, 0, spriteObj.startPos.y);
        
        spriteObj.sprite = sprite;
        this.sprites.set(spriteObj.id, sprite);
    }

    deleteInstance(spriteObj: SpriteObj): void {
        this.sprites.get(spriteObj.id).dispose();
    }
}