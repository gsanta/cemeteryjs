import { Camera3D } from "../../../models/misc/camera/Camera3D";
import { Registry } from "../../../Registry";
import { IEngineFacade } from "../../IEngineFacade";
import { ILightAdapter } from "../../ILightAdapter";
import { IMeshAdapter } from "../../IMeshAdapter";
import { IMeshFactory } from "../../IMeshFactory";
import { IMeshLoaderAdapter } from "../../IMeshLoaderAdapter";
import { ISpriteAdapter } from "../../ISpriteAdapter";
import { ISpriteLoaderAdapter } from "../../ISpriteLoaderAdapter";
import { Test_LightAdapter } from "./Test_LightAdapter";
import { Test_MeshAdapter } from "./Test_MeshAdapter";

export class Test_EngineFacade implements IEngineFacade {
    private registry: Registry;

    realEngine: IEngineFacade;
    
    spriteLoader: ISpriteLoaderAdapter;
    sprites: ISpriteAdapter;
    meshLoader: IMeshLoaderAdapter;
    meshes: IMeshAdapter;
    meshFactory: IMeshFactory;
    lights: ILightAdapter;

    constructor(registry: Registry) {
        this.registry = registry;

        this.lights = new Test_LightAdapter(this.registry, this);
        this.meshes = new Test_MeshAdapter(this.registry, this);
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