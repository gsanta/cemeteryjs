import { Color3, Engine, HemisphericLight, Light, Scene, Vector3 } from "babylonjs";
import { Camera3D } from "../../models/misc/camera/Camera3D";
import { Registry } from "../../Registry";
import { IEngineFacade } from "../IEngineFacade";
import { Bab_Meshes } from "./Bab_Meshes";
import { Bab_MeshLoader } from "./Bab_MeshLoader";
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

    private renderLoops: (() => void)[] = [];

    constructor(registry: Registry) {
        this.registry = registry;

        this.spriteLoader = new Bab_SpriteLoader(this.registry);
        this.sprites = new Bab_Sprites(this.registry, this);
        this.meshLoader = new Bab_MeshLoader(this.registry, this);
        this.meshes = new Bab_Meshes(this.registry, this);
    }

    getCamera(): Camera3D {
        return this.camera;
    }

    setup(canvas: HTMLCanvasElement) {
        this.engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
        this.scene = new Scene(this.engine);
        this.engine.getInputElement = () => canvas;

        this.camera = new Camera3D(this.registry, this.engine, this.scene);
        this.light = new HemisphericLight("light1", new Vector3(0, 1, 0), this.scene);

        this.light.diffuse = new Color3(1, 1, 1);
        this.light.specular = new Color3(0, 0, 0);

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