import { MeshObj } from "../models/objs/MeshObj";

export interface IMeshLoaderAdapter {
    load(meshObj: MeshObj): Promise<void>;
    clear(): void;
}