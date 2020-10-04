import { SpritePackedManager } from "babylonjs";
import { SpriteSheetObj } from "../../../models/objs/SpriteSheetObj";
import { Registry } from "../../../Registry";
import { ISpriteLoaderAdapter } from "../../ISpriteLoaderAdapter";
import { Wrap_EngineFacade } from "./Wrap_EngineFacade";

export class Wrap_SpriteLoader implements ISpriteLoaderAdapter {
    private registry: Registry;
    managers: Map<string, SpritePackedManager> = new Map();
    private engineFacade: Wrap_EngineFacade;

    constructor(registry: Registry, engineFacade: Wrap_EngineFacade) {
        this.registry = registry;
        this.engineFacade = engineFacade;
    }

    loadSpriteSheet(spriteSheetObj: SpriteSheetObj) {
        this.engineFacade.realEngine.spriteLoader.loadSpriteSheet(spriteSheetObj);
    }
}