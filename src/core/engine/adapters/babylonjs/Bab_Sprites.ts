import { Mesh, Sprite, SpriteManager, Vector3 } from "babylonjs";
import { Point } from "../../../../utils/geometry/shapes/Point";
import { SpriteObj } from "../../../models/objs/SpriteObj";
import { Registry } from "../../../Registry";
import { ISpriteAdapter } from "../../ISpriteAdapter";
import { Bab_EngineFacade } from "./Bab_EngineFacade";

const placeholderSpriteSheet = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFklEQVR42mKYaXQGDxqVxooAAQAA//81fp79VaAEvgAAAABJRU5ErkJggg=='

export class Bab_Sprites implements ISpriteAdapter {
    private registry: Registry;
    private engineFacade: Bab_EngineFacade;
    sprites: Map<string, Sprite> = new Map();
    private placeholderMeshes: Map<string, Mesh> = new Map();
    
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

        if (!sprite) {
            return new Point(0, 0);
        }

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
        if (!sprite) {
            return new Point(1, 1);
        }
        return new Point(sprite.width, sprite.height);
    } 

    updateInstance(spriteObj: SpriteObj): void {
        this.sprites.get(spriteObj.id).dispose();
        this.createInstance(spriteObj);
    }

    createInstance(spriteObj: SpriteObj) {
        const spriteSheetObj = this.registry.data.scene.items.getById(spriteObj.spriteSheetId);

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

        sprite.position = new Vector3(spriteObj.getPosition().x, 0, spriteObj.getPosition().y);
        
        this.sprites.set(spriteObj.id, sprite);
    }

    deleteInstance(spriteObj: SpriteObj): void {
        this.sprites.get(spriteObj.id) && this.sprites.get(spriteObj.id).dispose();
    }
}