import { Sprite } from "babylonjs";
import { Point } from "../../../../utils/geometry/shapes/Point";
import { Point_3 } from "../../../../utils/geometry/shapes/Point_3";
import { SpriteObj } from "../../../models/objs/SpriteObj";
import { Registry } from "../../../Registry";
import { ILightAdapter } from "../../ILightAdapter";
import { ISpriteAdapter } from "../../ISpriteAdapter";
import { Wrap_EngineFacade } from "./Wrap_EngineFacade";

export class Wrap_LightAdapter implements ILightAdapter {
    private registry: Registry;
    private engineFacade: Wrap_EngineFacade;
    sprites: Map<string, Sprite> = new Map();

    constructor(registry: Registry, engineFacade: Wrap_EngineFacade) {
        this.registry = registry;
        this.engineFacade = engineFacade;
    }

    setPosition(spriteObj: SpriteObj, pos: Point_3): void {
        this.registry.plugins.engineHooks.getSpriteHooks().forEach(spriteHook => spriteHook.setPositionHook(spriteObj, pos));
        this.engineFacade.realEngine.sprites.setPosition(spriteObj, pos);
    }

    getPosition(spriteObj: SpriteObj): Point {
        return this.engineFacade.realEngine.sprites.getPosition(spriteObj);
    }

    updateInstance(spriteObj: SpriteObj): void {
        this.engineFacade.realEngine.sprites.updateInstance(spriteObj);
    }

    createInstance(spriteObj: SpriteObj) {
        this.engineFacade.realEngine.sprites.createInstance(spriteObj);
    }

    deleteInstance(spriteObj: SpriteObj): void {
        this.engineFacade.realEngine.sprites.deleteInstance(spriteObj);
    }
}