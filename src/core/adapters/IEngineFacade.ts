import { ISpriteLoaderAdapter } from "./ISpriteLoaderAdapter";
import { ISpriteAdapter } from "./ISpriteAdapter";


export interface IEngineFacade {
    spriteLoader: ISpriteLoaderAdapter;
    sprites: ISpriteAdapter;
    
    setup(canvas: HTMLCanvasElement): void;
}

