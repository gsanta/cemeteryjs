import { ISpriteLoaderAdapter } from "./ISpriteLoaderAdapter";


export interface IEngineFacade {
    spriteLoader: ISpriteLoaderAdapter;
    setup(): void;
}

