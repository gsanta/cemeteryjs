import { Sprite } from "babylonjs";
import { MeshObj } from "../../../models/objs/MeshObj";
import { Registry } from "../../../Registry";
import { IAnimationAdapter } from "../../IAnimationAdapter";
import { Wrap_EngineFacade } from "./Wrap_EngineFacade";

export class Wrap_AnimationAdapter implements IAnimationAdapter {
    private registry: Registry;
    private engineFacade: Wrap_EngineFacade;
    sprites: Map<string, Sprite> = new Map();

    constructor(registry: Registry, engineFacade: Wrap_EngineFacade) {
        this.registry = registry;
        this.engineFacade = engineFacade;
    }
    
    startAnimation(meshObj: MeshObj, animationName: string): void {
        this.engineFacade.realEngine.animatons.startAnimation(meshObj, animationName);
    }

    stopAnimation(meshObj: MeshObj, animationName: string): void {
        this.engineFacade.realEngine.animatons.stopAnimation(meshObj, animationName);
    }

    stopAllAnimations(meshObj: MeshObj): void {
        this.engineFacade.realEngine.animatons.stopAllAnimations(meshObj);
    }
}