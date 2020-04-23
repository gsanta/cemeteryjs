import { Color3, HemisphericLight, MeshBuilder, Vector3, Engine, Scene, Camera, ArcRotateCamera } from "babylonjs";
import { HelperMeshes } from "./HelperMeshes";

export class GameEngine {
    engine: Engine;
    scene: Scene;
    private helperMeshes: HelperMeshes;
    private canvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        
        this.engine = new Engine(this.canvas, true, { preserveDrawingBuffer: true, stencil: true });
        
        let target = new Vector3(100, 0, 0);
        
        const scene = new Scene(this.engine);


        this.helperMeshes = new HelperMeshes(this.scene, MeshBuilder);
        const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);
        
        light.diffuse = new Color3(1, 1, 1);
        light.specular = new Color3(0, 0, 0);
        const lightMesh = MeshBuilder.CreateBox('light-cube', {size: 1}, scene);
        lightMesh.translate(new Vector3(5, 200, 0), 1);

        this.scene = scene;

        this.engine.runRenderLoop(() => this.scene.render());
    }
}