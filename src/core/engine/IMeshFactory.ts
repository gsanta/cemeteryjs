import { MeshObj } from "../models/objs/MeshObj";

export type BoxConfig = {
    width?: number;
    height?: number;
    depth?: number;
}

/**
 * This is a factory which can create simple mesh shapes like box, sphere etc.
 */
export interface IMeshFactory {
    box(meshObj: MeshObj);
    sphere(meshObj: MeshObj);
    ground(meshObj: MeshObj);
}