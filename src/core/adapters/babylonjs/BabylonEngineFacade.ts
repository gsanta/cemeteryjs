import { IEngineFacade } from "../IEngineFacade";
import { Registry } from "../../Registry";
import { ArcRotateCamera, Vector3, HemisphericLight, PointLight, Scene, Engine, Light, Color3 } from "babylonjs";
import { BabylonSpriteLoader } from "./BabylonSpriteLoader";
import { Babylon_SpriteAdapter } from "./Babylon_SpriteAdapter";
import { Bab_MeshLoader } from "./Bab_MeshLoader";
import { Camera3D } from "../../models/misc/camera/Camera3D";

export class BabylonEngineFacade implements IEngineFacade {
    scene: Scene;
    engine: Engine;
    private camera: Camera3D;
    private registry: Registry;
    private light: Light;

    spriteLoader: BabylonSpriteLoader;
    sprites: Babylon_SpriteAdapter;
    meshLoader: Bab_MeshLoader;

    constructor(registry: Registry) {
        this.registry = registry;

        this.spriteLoader = new BabylonSpriteLoader(this.registry);
        this.sprites = new Babylon_SpriteAdapter(this.registry, this);
        this.meshLoader = new Bab_MeshLoader(this.registry, this);
    }

    getCamera(): Camera3D {
        return this.camera;
    }

    setup(canvas: HTMLCanvasElement) {
        this.engine = new Engine(canvas, true);
        this.scene = new Scene(this.engine);


        this.camera = new Camera3D(this.registry, this.engine, this.scene);
        this.light = new HemisphericLight("light1", new Vector3(0, 1, 0), this.scene);

        this.light.diffuse = new Color3(1, 1, 1);
        this.light.specular = new Color3(0, 0, 0);

        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
    }

    resize() {
        this.engine.resize();
    }
}