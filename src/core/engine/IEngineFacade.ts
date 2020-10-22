import { ISpriteLoaderAdapter } from "./ISpriteLoaderAdapter";
import { ISpriteAdapter } from "./ISpriteAdapter";
import { IMeshLoaderAdapter as IMeshLoader } from "./IMeshLoaderAdapter";
import { Camera3D } from "../models/misc/camera/Camera3D";
import { IMeshAdapter } from "./IMeshAdapter";
import { IMeshFactory } from "./IMeshFactory";

export interface IEngineFacade {
    spriteLoader: ISpriteLoaderAdapter;
    sprites: ISpriteAdapter;
    meshes: IMeshAdapter;
    meshLoader: IMeshLoader;
    meshFactory: IMeshFactory;
    
    setup(canvas: HTMLCanvasElement): void;
    getCamera(): Camera3D;
    resize();
    registerRenderLoop(loop: () => void);
}

