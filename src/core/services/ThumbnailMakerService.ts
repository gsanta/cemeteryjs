import { Scene, Engine, ArcRotateCamera, Vector3, HemisphericLight, PointLight, MeshBuilder } from "babylonjs";


export class ThumbnailMakerService {
    constructor() {

    }

    setup(canvas: HTMLCanvasElement) {
        const engine = new Engine(canvas, true);
        var scene = new Scene(engine);

        var camera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, Vector3.Zero(), scene);
    
        var light1 = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);
        var sphere = MeshBuilder.CreateSphere("sphere", {}, scene);

        engine.runRenderLoop(() => scene.render());
    }
}