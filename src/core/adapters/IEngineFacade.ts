import { ISpriteLoaderAdapter } from "./ISpriteLoaderAdapter";
import { ISpriteAdapter } from "./ISpriteAdapter";
import { IMeshLoaderAdapter as IMeshLoader } from "./IMeshLoaderAdapter";
import { Camera3D } from "../models/misc/camera/Camera3D";
import { IMeshAdapter } from "./IMeshAdapter";


export interface IEngineFacade {
    spriteLoader: ISpriteLoaderAdapter;
    sprites: ISpriteAdapter;
    meshes: IMeshAdapter;
    meshLoader: IMeshLoader;
    
    setup(canvas: HTMLCanvasElement): void;
    getCamera(): Camera3D;
    resize();
}

