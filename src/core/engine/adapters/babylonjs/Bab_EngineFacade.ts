import { Color3, Engine, HemisphericLight, Light, Scene, Vector3 } from "babylonjs";
import { Camera3D } from "../../../models/misc/camera/Camera3D";
import { Registry } from "../../../Registry";
import { Bab_LightAdapter } from "../../Bab_LightAdapter";
import { IEngineFacade } from "../../IEngineFacade";
import { Bab_Meshes } from "./Bab_Meshes";
import { Bab_MeshFactory } from "./Bab_MeshFactory";
import { Bab_MeshLoader } from "./Bab_MeshLoader";
import { Bab_RayCasterAdapter } from "./Bab_RayCasterAdapter";
import { Bab_SpriteLoader } from "./Bab_SpriteLoader";
import { Bab_Sprites } from "./Bab_Sprites";

export class Bab_EngineFacade implements IEngineFacade {
    scene: Scene;
    engine: Engine;
    private camera: Camera3D;
    private registry: Registry;
    private light: Light;
    
    spriteLoader: Bab_SpriteLoader;
    sprites: Bab_Sprites;
    meshLoader: Bab_MeshLoader;
    meshes: Bab_Meshes;
    meshFactory: Bab_MeshFactory;
    lights: Bab_LightAdapter;
    rayCaster: Bab_RayCasterAdapter;

    private renderLoops: (() => void)[] = [];

    constructor(registry: Registry) {
        this.registry = registry;

        this.camera = new Camera3D(this.registry);
        this.spriteLoader = new Bab_SpriteLoader(this.registry, this);
        this.sprites = new Bab_Sprites(this.registry, this);
        this.meshLoader = new Bab_MeshLoader(this.registry, this);
        this.meshes = new Bab_Meshes(this.registry, this);
        this.meshFactory = new Bab_MeshFactory(this.registry, this);
        this.lights = new Bab_LightAdapter(this.registry, this);
        this.rayCaster = new Bab_RayCasterAdapter(this.registry, this);
    }

    getCamera(): Camera3D {
        return this.camera;
    }

    setup(canvas: HTMLCanvasElement) {
        this.engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
        this.scene = new Scene(this.engine);
        this.engine.getInputElement = () => canvas;
        this.camera.setEngine(this);
        this.light = new HemisphericLight("light1", new Vector3(0, 1, 0), this.scene);

        this.light.diffuse = new Color3(1, 1, 1);
        // this.light.specular = new Color3(0, 0, 0);
        this.light.intensity = 0.2;

        this.engine.runRenderLoop(() => {
            this.scene.render();
        });

        this.renderLoops.forEach(renderLoop => this.engine.runRenderLoop(renderLoop));
    }

    registerRenderLoop(loop: () => void) {
        this.renderLoops.push(loop);

        if (this.engine) {
            this.engine.runRenderLoop(loop);
        }
    }

    resize() {
        this.engine.resize();
    }
}