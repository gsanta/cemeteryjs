import { IEngineFacade } from "../IEngineFacade";
import { Registry } from "../../Registry";
import { ArcRotateCamera, Vector3, HemisphericLight, PointLight, Scene, Engine } from "babylonjs";
import { BabylonSpriteLoader } from "./BabylonSpriteLoader";
import { Babylon_SpriteAdapter } from "./Babylon_SpriteAdapter";

export class BabylonEngineFacade implements IEngineFacade {
    scene: Scene;
    engine: Engine;
    private registry: Registry;

    spriteLoader: BabylonSpriteLoader;
    sprites: Babylon_SpriteAdapter;

    constructor(registry: Registry) {
        this.registry = registry;

        this.spriteLoader = new BabylonSpriteLoader(this.registry);
        this.sprites = new Babylon_SpriteAdapter(this.registry);
    }

    setup(canvas: HTMLCanvasElement) {
        this.engine = new Engine(canvas, true);
        this.scene = new Scene(this.engine);

        var camera = new ArcRotateCamera(
            "Camera",
            Math.PI / 2,
            Math.PI / 2,
            2,
            Vector3.Zero(),
            this.scene
        );
        camera.attachControl(canvas, true);

        new HemisphericLight(
            "light1",
            new Vector3(1, 1, 0),
            this.scene
        );
        
        new PointLight(
            "light2",
            new Vector3(0, 1, -1),
            this.scene
        );

        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
    }
}