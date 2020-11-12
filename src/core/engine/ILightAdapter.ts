import { Point } from "../../utils/geometry/shapes/Point";
import { LightObj } from "../models/objs/LightObj";

export interface ILightAdapter {
    setPosition(lightObj: LightObj, pos: Point): void;
    getPosition(lightObj: LightObj): Point;
    createInstance(lightObj: LightObj): void;
    updateInstance(lightObj: LightObj): void;
    deleteInstance(lightObj: LightObj): void;
}