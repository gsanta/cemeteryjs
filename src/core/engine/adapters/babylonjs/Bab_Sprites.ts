import { Mesh, Sprite, SpriteManager, Vector3 } from "babylonjs";
import { Point } from "../../../../utils/geometry/shapes/Point";
import { SpriteObj } from "../../../models/objs/SpriteObj";
import { Registry } from "../../../Registry";
import { RectangleFactory } from "../../../stores/RectangleFactory";
import { ISpriteAdapter } from "../../ISpriteAdapter";
import { Bab_EngineFacade } from "./Bab_EngineFacade";

const placeholderSpriteSheet = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAA9UlEQVR4nO3RQQHAIBDAsGO6EIJFVA4bfSQWsvY9/5DxqWgREiMkRkiMkBghMUJihMQIiRESIyRGSIyQGCExQmKExAiJERIjJEZIjJAYITFCYoTECIkREiMkRkiMkBghMUJihMQIiRESIyRGSIyQGCExQmKExAiJERIjJEZIjJAYITFCYoTECIkREiMkRkiMkBghMUJihMQIiRESIyRGSIyQGCExQmKExAiJERIjJEZIjJAYITFCYoTECIkREiMkRkiMkBghMUJihMQIiRESIyRGSIyQGCExQmKExAiJERIjJEZIjJAYITFCYoTECIkREiOkZGYe3KcDBIuxwCIAAAAASUVORK5CYII='

export class Bab_Sprites implements ISpriteAdapter {
    private registry: Registry;
    private engineFacade: Bab_EngineFacade;
    sprites: Map<string, Sprite> = new Map();
    private placeholderMeshes: Map<string, Mesh> = new Map();
    
    private rectangleFactory: RectangleFactory = new RectangleFactory(0.1, 'green');
    private placeholderSpriteManager: SpriteManager;

    constructor(registry: Registry, engineFacade: Bab_EngineFacade) {
        this.registry = registry;
        this.engineFacade = engineFacade;
    }

    setPosition(spriteObj: SpriteObj, pos: Point): void {
        const sprite = this.sprites.get(spriteObj.id);
        if (!sprite) { return; }

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

    getScale(spriteObj: SpriteObj): Point {
        const sprite = this.sprites.get(spriteObj.id);
        if (sprite) {
            return new Point(sprite.width, sprite.height);
        }
    } 

    updateInstance(spriteObj: SpriteObj): void {
        this.sprites.get(spriteObj.id).dispose();
        this.createInstance(spriteObj);
    }

    createInstance(spriteObj: SpriteObj) {
        const spriteSheetObj = this.registry.stores.objStore.getById(spriteObj.spriteSheetId);

        //  TODO: better place for it!
        if (!this.placeholderSpriteManager) {
            this.placeholderSpriteManager = new SpriteManager("placeholderManager", placeholderSpriteSheet, 2000, 100, this.engineFacade.scene);
        }

        let sprite: Sprite;

        if (!spriteSheetObj || !spriteObj.frameName) {
            sprite = new Sprite(`${spriteObj.id}`, this.placeholderSpriteManager);
        } else {
            sprite = new Sprite(`${spriteObj.id}`, this.engineFacade.spriteLoader.managers.get(spriteSheetObj.id));
            sprite.cellRef = spriteObj.frameName;
        }

        sprite.width = spriteObj.getScale().x;
        sprite.height = spriteObj.getScale().y;

        sprite.position = new Vector3(spriteObj.startPos.x, 0, spriteObj.startPos.y);
        
        spriteObj.sprite = sprite;
        this.sprites.set(spriteObj.id, sprite);
    }

    deleteInstance(spriteObj: SpriteObj): void {
        this.sprites.get(spriteObj.id) && this.sprites.get(spriteObj.id).dispose();
    }
}