import { Sprite } from "babylonjs";
import { Point_3 } from "../../../../utils/geometry/shapes/Point_3";
import { LightObj } from "../../../models/objs/LightObj";
import { Registry } from "../../../Registry";
import { ILightAdapter } from "../../ILightAdapter";
import { Test_EngineFacade } from "./Test_EngineFacade";

export class Test_LightAdapter implements ILightAdapter {
    private registry: Registry;
    private engineFacade: Test_EngineFacade;
    sprites: Map<string, Sprite> = new Map();

    constructor(registry: Registry, engineFacade: Test_EngineFacade) {
        this.registry = registry;
        this.engineFacade = engineFacade;
    }

    setPosition(lightObj: LightObj, pos: Point_3): void {
    }

    getPosition(lightObj: LightObj): Point_3 {
        return undefined;
    }

    
    setDirection(lightObj: LightObj, pos: Point_3): void {
    }

    getDirection(lightObj: LightObj): Point_3 {
        return undefined;
    }


    setAngle(lightObj: LightObj, angleRad: number): void {
    }
    
    getAngle(lightObj: LightObj): number {
        return undefined;
    }

    updateInstance(lightObj: LightObj): void {
    }

    createInstance(lightObj: LightObj) {
    }

    deleteInstance(lightObj: LightObj): void {
    }
}