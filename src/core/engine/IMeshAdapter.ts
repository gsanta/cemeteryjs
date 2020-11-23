import { MeshObj } from "../models/objs/MeshObj";
import { Point } from "../../utils/geometry/shapes/Point";
import { Point_3 } from "../../utils/geometry/shapes/Point_3";

export interface IMeshAdapter {
    translate(meshObj: MeshObj, axis: 'x' | 'y' | 'z', amount: number, space?: 'local' | 'global'): void;
    rotate(meshObj: MeshObj, angle: number): void;
    setRotation(meshObj: MeshObj, angle: number): void;
    getRotation(meshObj: MeshObj): number;
    setPosition(meshObj: MeshObj, pos: Point_3): void;
    getPosition(meshObj: MeshObj): Point_3;
    setScale(meshObj: MeshObj, point: Point); 
    getScale(meshObj: MeshObj): Point; 

    getDimensions(meshObj: MeshObj): Point;
    createInstance(meshObj: MeshObj): Promise<boolean>;
    deleteInstance(meshObj: MeshObj): void;

    createMaterial(meshObj: MeshObj);

    playAnimation(meshObj: MeshObj, startFrame: number, endFrame: number, repeat: boolean);
}