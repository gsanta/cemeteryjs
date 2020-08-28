import { MeshObj } from "../models/game_objects/MeshObj";
import { Mesh } from "babylonjs";
import { Point } from "../../utils/geometry/shapes/Point";

export interface IMeshAdapter {
    load(meshObj: MeshObj): Promise<Mesh>;
    getDimensions(meshObj: MeshObj): Point;
    createInstance(meshObj: MeshObj): Promise<void>;
    deleteInstance(meshObj: MeshObj): void;
    createMaterial(meshModel: MeshObj);
    clear(): void;
}