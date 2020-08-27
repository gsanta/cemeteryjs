import { MeshObj } from "../models/game_objects/MeshObj";


export interface IMeshAdapter {
    load(meshObj: MeshObj);
}