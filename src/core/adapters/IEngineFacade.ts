import { ISpriteLoaderAdapter } from "./ISpriteLoaderAdapter";
import { ISpriteAdapter } from "./ISpriteAdapter";
import { IMeshAdapter as IMeshLoader } from "./IMeshLoader";


export interface IEngineFacade {
    spriteLoader: ISpriteLoaderAdapter;
    sprites: ISpriteAdapter;
    meshLoader: IMeshLoader;
    
    setup(canvas: HTMLCanvasElement): void;
}

