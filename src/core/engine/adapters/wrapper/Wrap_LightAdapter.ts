import { Sprite } from "babylonjs";
import { Point_3 } from "../../../../utils/geometry/shapes/Point_3";
import { LightObj } from "../../../models/objs/LightObj";
import { MeshObj } from "../../../models/objs/MeshObj";
import { Registry } from "../../../Registry";
import { ILightAdapter } from "../../ILightAdapter";
import { Wrap_EngineFacade } from "./Wrap_EngineFacade";

export class Wrap_LightAdapter implements ILightAdapter {
    private registry: Registry;
    private engineFacade: Wrap_EngineFacade;
    sprites: Map<string, Sprite> = new Map();

    constructor(registry: Registry, engineFacade: Wrap_EngineFacade) {
        this.registry = registry;
        this.engineFacade = engineFacade;
    }

    setPosition(lightObj: LightObj, pos: Point_3): void {
        this.engineFacade.realEngine.lights.setPosition(lightObj, pos);
    }

    getPosition(lightObj: LightObj): Point_3 {
        return this.engineFacade.realEngine.lights.getPosition(lightObj);
    }

    setDirection(lightObj: LightObj, pos: Point_3): void {
        this.engineFacade.realEngine.lights.setDirection(lightObj, pos);
    }

    getDirection(lightObj: LightObj): Point_3 {
        return this.engineFacade.realEngine.lights.getDirection(lightObj);
    }

    setAngle(lightObj: LightObj, angleRad: number): void {
        this.engineFacade.realEngine.lights.setAngle(lightObj, angleRad);
    }
    
    getAngle(lightObj: LightObj): number {
        return this.engineFacade.realEngine.lights.getAngle(lightObj);
    }

    setDiffuseColor(lightObj: LightObj, diffuseColor: string): void {
        this.engineFacade.realEngine.lights.setDiffuseColor(lightObj, diffuseColor);
    }

    getDiffuseColor(lightObj: LightObj): string {
        return this.engineFacade.realEngine.lights.getDiffuseColor(lightObj);
    }

    setParent(lightObj: LightObj, parent: MeshObj): void {
        this.registry.plugins.engineHooks.getLightHooks().forEach(lightHook => lightHook.hook_setParent(lightObj, parent));
        this.engineFacade.realEngine.lights.setParent(lightObj, parent);
    }

    updateInstance(lightObj: LightObj): void {
        this.engineFacade.realEngine.lights.updateInstance(lightObj);
    }

    createInstance(lightObj: LightObj) {
        this.engineFacade.realEngine.lights.createInstance(lightObj);
    }

    deleteInstance(lightObj: LightObj): void {
        this.engineFacade.realEngine.lights.deleteInstance(lightObj);
    }
}