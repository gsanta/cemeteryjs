import { MeshObj } from "../models/game_objects/MeshObj";
import { Point } from "../../utils/geometry/shapes/Point";

export interface IMeshAdapter {
    getDimensions(meshObj: MeshObj): Point;
    createInstance(meshObj: MeshObj): Promise<void>;
    deleteInstance(meshObj: MeshObj): void;
}