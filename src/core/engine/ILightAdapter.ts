import { Point } from "../../utils/geometry/shapes/Point";
import { Point_3 } from "../../utils/geometry/shapes/Point_3";
import { LightObj } from "../models/objs/LightObj";

export interface ILightAdapter {
    setPosition(lightObj: LightObj, pos: Point_3): void;
    getPosition(lightObj: LightObj): Point_3;
    setDirection(lightObj: LightObj, pos: Point_3): void;
    getDirection(lightObj: LightObj): Point_3;
    setAngle(lightObj: LightObj, angleRad: number): void;
    getAngle(lightObj: LightObj): number;
    setDiffuseColor(lightObj: LightObj, diffuseColor: string): void;
    getDiffuseColor(lightObj: LightObj): string;
    createInstance(lightObj: LightObj): void;
    updateInstance(lightObj: LightObj): void;
    deleteInstance(lightObj: LightObj): void;
}