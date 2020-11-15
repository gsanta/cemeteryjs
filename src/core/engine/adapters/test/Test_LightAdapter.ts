import { Sprite } from "babylonjs";
import { Point_3 } from "../../../../utils/geometry/shapes/Point_3";
import { LightObj } from "../../../models/objs/LightObj";
import { Registry } from "../../../Registry";
import { defaultLightDirection } from "../../Bab_LightAdapter";
import { ILightAdapter } from "../../ILightAdapter";
import { Test_EngineFacade } from "./Test_EngineFacade";

export class Test_LightAdapter implements ILightAdapter {
    private registry: Registry;
    private engineFacade: Test_EngineFacade;
    sprites: Map<string, Sprite> = new Map();

    directionMap: Map<string, Point_3> = new Map();
    positionMap: Map<string, Point_3> = new Map();
    diffuseColorMap: Map<string, string> = new Map();

    constructor(registry: Registry, engineFacade: Test_EngineFacade) {
        this.registry = registry;
        this.engineFacade = engineFacade;
    }

    setPosition(lightObj: LightObj, pos: Point_3): void {
        this.positionMap.set(lightObj.id, pos);
    }

    getPosition(lightObj: LightObj): Point_3 {
        return this.positionMap.get(lightObj.id) || lightObj.startPos;
    }

    setDirection(lightObj: LightObj, dir: Point_3): void {
        this.directionMap.set(lightObj.id, dir);
    }

    getDirection(lightObj: LightObj): Point_3 {
        return this.directionMap.get(lightObj.id) || defaultLightDirection;
    }

    setDiffuseColor(lightObj: LightObj, diffuseColor: string): void {
        this.diffuseColorMap.set(lightObj.id, diffuseColor);
    }

    getDiffuseColor(lightObj: LightObj): string {
        return this.diffuseColorMap.get(lightObj.id);
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