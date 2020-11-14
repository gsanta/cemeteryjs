import { Sprite } from "babylonjs";
import { Point_3 } from "../../../../utils/geometry/shapes/Point_3";
import { LightObj } from "../../../models/objs/LightObj";
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