import { Camera3D } from "../../../models/misc/camera/Camera3D";
import { Registry } from "../../../Registry";
import { IEngineFacade } from "../../IEngineFacade";
import { Wrap_Meshes } from "./Wrap_Meshes";
import { Wrap_MeshLoader } from "./Wrap_MeshLoader";
import { Wrap_SpriteLoader } from "./Wrap_SpriteLoader";
import { Wrap_Sprites } from "./Wrap_Sprites";

export class Wrap_EngineFacade implements IEngineFacade {
    private registry: Registry;

    realEngine: IEngineFacade;
    
    spriteLoader: Wrap_SpriteLoader;
    sprites: Wrap_Sprites;
    meshLoader: Wrap_MeshLoader;
    meshes: Wrap_Meshes;

    constructor(registry: Registry) {
        this.registry = registry;

        this.spriteLoader = new Wrap_SpriteLoader(this.registry, this);
        this.sprites = new Wrap_Sprites(this.registry, this);
        this.meshLoader = new Wrap_MeshLoader(this.registry, this);
        this.meshes = new Wrap_Meshes(this.registry, this);
    }

    getCamera(): Camera3D {
        return this.realEngine.getCamera();
    }

    setup(canvas: HTMLCanvasElement) {
        this.realEngine.setup(canvas);
    }

    registerRenderLoop(loop: () => void) {
        this.realEngine.registerRenderLoop(loop);
    }

    resize() {
        this.realEngine.resize();
    }
}