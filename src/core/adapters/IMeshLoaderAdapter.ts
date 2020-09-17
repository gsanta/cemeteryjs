import { MeshObj } from "../models/game_objects/MeshObj";

export interface IMeshLoaderAdapter {
    load(meshObj: MeshObj): Promise<void>;
    clear(): void;
}