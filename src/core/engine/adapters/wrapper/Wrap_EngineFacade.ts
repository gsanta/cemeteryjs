import { Camera3D } from "../../../models/misc/camera/Camera3D";
import { Registry } from "../../../Registry";
import { IAnimationAdapter } from "../../IAnimationAdapter";
import { IEngineFacade } from "../../IEngineFacade";
import { Test_EngineFacade } from "../test/Test_EngineFacade";
import { Wrap_AnimationAdapter } from "./Wrap_AnimationAdapter";
import { Wrap_GizmoAdapter } from "./Wrap_GizmoAdapter";
import { Wrap_LightAdapter } from "./Wrap_LightAdapter";
import { Wrap_Meshes } from "./Wrap_MeshAdapter";
import { Wrap_MeshFactory } from "./Wrap_MeshFactory";
import { Wrap_MeshLoader } from "./Wrap_MeshLoader";
import { Wrap_PhysicsAdapter } from "./Wrap_PhysicsAdapter";
import { Wrap_RayCasterAdapter } from "./Wrap_RayCasterAdapter";
import { Wrap_SpriteLoader } from "./Wrap_SpriteLoader";
import { Wrap_Sprites } from "./Wrap_Sprites";
import { Wrap_ToolAdapter } from "./Wrap_ToolAdapter";

export class Wrap_EngineFacade implements IEngineFacade {
    private registry: Registry;

    realEngine: IEngineFacade;
    
    spriteLoader: Wrap_SpriteLoader;
    sprites: Wrap_Sprites;
    meshLoader: Wrap_MeshLoader;
    meshes: Wrap_Meshes;
    meshFactory: Wrap_MeshFactory;
    lights: Wrap_LightAdapter;
    rays: Wrap_RayCasterAdapter;
    physics: Wrap_PhysicsAdapter;
    animatons: Wrap_AnimationAdapter;
    gizmos: Wrap_GizmoAdapter;
    tools: Wrap_ToolAdapter;

    engines: IEngineFacade[] = [];

    testEngine: Test_EngineFacade;

    constructor(registry: Registry, realEngine: IEngineFacade) {
        this.registry = registry;

        this.testEngine = new Test_EngineFacade(registry);
        this.engines.push(this.testEngine);

        if (realEngine) {
            this.realEngine = realEngine;
            this.engines.unshift(this.realEngine);
        }

        this.spriteLoader = new Wrap_SpriteLoader(this.registry, this);
        this.sprites = new Wrap_Sprites(this.registry, this);
        this.meshLoader = new Wrap_MeshLoader(this.registry, this);
        this.meshes = new Wrap_Meshes(this.registry, this);
        this.meshFactory = new Wrap_MeshFactory(this.registry, this);
        this.lights = new Wrap_LightAdapter(this.registry, this);
        this.rays = new Wrap_RayCasterAdapter(this.registry, this);
        this.physics = new Wrap_PhysicsAdapter(this);
        this.animatons = new Wrap_AnimationAdapter(this.registry, this);
        this.gizmos = new Wrap_GizmoAdapter(this);
        this.tools = new Wrap_ToolAdapter(this);
    }

    getCamera(): Camera3D {
        return this.realEngine.getCamera(); 
    }

    setup(canvas: HTMLCanvasElement) {
        this.realEngine.setup(canvas);
    }

    clear() {
        this.realEngine.clear();
        this.testEngine.clear();
    }

    registerRenderLoop(loop: () => void) {
        this.realEngine.registerRenderLoop(loop);
    }

    onReady(onReadyFunc: () => void) {
        this.realEngine.onReady(onReadyFunc);
    }

    resize() {
        this.realEngine.resize();
    }
}