import { ISpriteLoaderAdapter } from "./ISpriteLoaderAdapter";
import { ISpriteAdapter } from "./ISpriteAdapter";
import { IMeshLoaderAdapter as IMeshLoader } from "./IMeshLoaderAdapter";
import { Camera3D } from "../models/misc/camera/Camera3D";
import { IMeshAdapter } from "./IMeshAdapter";
import { IMeshFactory } from "./IMeshFactory";
import { ILightAdapter } from "./ILightAdapter";
import { IRayCasterAdapter } from "./IRayCasterAdapter";

export interface IEngineFacade {
    spriteLoader: ISpriteLoaderAdapter;
    sprites: ISpriteAdapter;
    meshes: IMeshAdapter;
    lights: ILightAdapter;
    meshLoader: IMeshLoader;
    meshFactory: IMeshFactory;
    rays: IRayCasterAdapter;
    
    setup(canvas: HTMLCanvasElement): void;
    clear(): void;
    getCamera(): Camera3D;
    resize();
    registerRenderLoop(loop: () => void);
    onReady(onReadyFunc: () => void);
}

