import { Point_3 } from "../../../utils/geometry/shapes/Point_3";
import { Canvas3dPanel } from "../modules/Canvas3dPanel";
import { IObj } from "./IObj";
import { MeshObj } from "./MeshObj";

export const RayObjType = 'ray-obj';

export class RayObj implements IObj {
    readonly objType = RayObjType;
    id: string;
    name: string;
    meshObj: MeshObj;

    rayLength: number;
    origin: Point_3;
    direction: Point_3;

    pickedMeshObj: MeshObj;
    canvas: Canvas3dPanel;

    constructor(canvas: Canvas3dPanel) {
        this.canvas = canvas;
    }

    createHelper() {

    }

    removeHelper() {

    }

    getOrigin() {

    }

    dispose() {}
    serialize() { return undefined; }
    deserialize() {}
    clone() { return undefined; }
}