import { MeshObj } from "../models/objs/MeshObj";
import { Point } from "../../utils/geometry/shapes/Point";
import { Point_3 } from "../../utils/geometry/shapes/Point_3";

export interface IMeshAdapter {
    translate(meshObj: MeshObj, axis: 'x' | 'y' | 'z', amount: number, space?: 'local' | 'global'): void;
    setRotation(meshObj: MeshObj, rot: Point_3): void;
    getRotation(meshObj: MeshObj): Point_3;
    setPosition(meshObj: MeshObj, pos: Point_3): void;
    getPosition(meshObj: MeshObj): Point_3;
    setScale(meshObj: MeshObj, point: Point); 
    getScale(meshObj: MeshObj): Point_3;
    setColor(meshObj: MeshObj, color: string): void;
    getColor(meshObj: MeshObj): string;

    getDimensions(meshObj: MeshObj): Point;
    createInstance(meshObj: MeshObj): Promise<boolean>;
    deleteInstance(meshObj: MeshObj): void;

    createMaterial(meshObj: MeshObj);

    playAnimation(meshObj: MeshObj, startFrame: number, endFrame: number, repeat: boolean);
}