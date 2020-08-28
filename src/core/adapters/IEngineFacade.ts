import { ISpriteLoaderAdapter } from "./ISpriteLoaderAdapter";
import { ISpriteAdapter } from "./ISpriteAdapter";
import { IMeshAdapter as IMeshLoader } from "./IMeshLoader";
import { Camera3D } from "../models/misc/camera/Camera3D";


export interface IEngineFacade {
    spriteLoader: ISpriteLoaderAdapter;
    sprites: ISpriteAdapter;
    meshLoader: IMeshLoader;
    
    setup(canvas: HTMLCanvasElement): void;
    getCamera(): Camera3D;
    resize();
}

