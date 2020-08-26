import { IEngineFacade } from "../IEngineFacade";
import { Registry } from "../../Registry";
import { Engine } from "babylonjs/Engines/engine";
import { Scene } from "babylonjs/scene";
import { ArcRotateCamera, Vector3, HemisphericLight, PointLight } from "babylonjs";


export class BabylonEngineFacade implements IEngineFacade {
    private scene: Scene;
    private engine: Engine;

    constructor(registry: Registry) {

    }


    setup(canvas: HTMLCanvasElement) {
        this.engine = new Engine(canvas, true);
        this.scene = new Scene(engine);
  
        // Add a camera to the scene and attach it to the canvas
        var camera = new ArcRotateCamera(
        "Camera",
        Math.PI / 2,
        Math.PI / 2,
        2,
        Vector3.Zero(),
        scene
        );
        camera.attachControl(canvas, true);
    
        // Add lights to the scene
        var light1 = new HemisphericLight(
        "light1",
        new Vector3(1, 1, 0),
        scene
        );
        var light2 = new PointLight(
        "light2",
        new Vector3(0, 1, -1),
        scene
        );
    
        // This is where you create and manipulate meshes
        // var sphere = MeshBuilder.CreateSphere(
        //   "sphere",
        //   { diameter: 2 },
        //   scene
        // );
    
        engine.runRenderLoop(function () {
            scene.render();
        });
    }
}