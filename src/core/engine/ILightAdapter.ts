import { Point_3 } from "../../utils/geometry/shapes/Point_3";
import { IGameObj } from "../models/objs/IGameObj";
import { IObj } from "../models/objs/IObj";
import { LightObj } from "../models/objs/LightObj";

export interface ILightAdapter {
    setPosition(lightObj: LightObj, pos: Point_3): void;
    getPosition(lightObj: LightObj): Point_3;
    setDirection(lightObj: LightObj, pos: Point_3): void;
    getDirection(lightObj: LightObj): Point_3;
    setAngle(lightObj: LightObj, angleRad: number): void;
    getAngle(lightObj: LightObj): number;
    setParent(lightObj: LightObj, parent: IObj & IGameObj): void;
    setDiffuseColor(lightObj: LightObj, diffuseColor: string): void;
    getDiffuseColor(lightObj: LightObj): string;
    createInstance(lightObj: LightObj): void;
    updateInstance(lightObj: LightObj): void;
    deleteInstance(lightObj: LightObj): void;
}