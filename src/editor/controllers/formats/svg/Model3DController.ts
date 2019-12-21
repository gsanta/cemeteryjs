import { Engine, Scene } from 'babylonjs';
import { ModelLoader } from '../../../../world_generator/services/ModelLoader';
import { CanvasItem } from './models/GridCanvasStore';
import { SvgCanvasController } from './SvgCanvasController';


export class Model3DController {
    private engine: Engine;
    private scene: Scene;
    private modelLoader: ModelLoader;
    private canvasController: SvgCanvasController;

    private canvas: HTMLCanvasElement;

    constructor(canvasController: SvgCanvasController) {
        this.canvasController = canvasController;
        this.canvas = <HTMLCanvasElement> document.getElementById("model-size-tester");
        this.init();
        this.modelLoader = new ModelLoader(this.scene);
    }

    set3dModelForCanvasItem(canvasItem: CanvasItem) {
        this.modelLoader.load(canvasItem.model).then(modelData => {
            canvasItem.dimensions = canvasItem.dimensions.setWidth(modelData.dimensions.x).setHeight(modelData.dimensions.y);
            this.canvasController.renderCanvas();
        });
    }

    private init() {
        this.engine = new Engine(this.canvas, true, { preserveDrawingBuffer: true, stencil: true });
        this.scene = new Scene(this.engine);
        this.engine.runRenderLoop(() => this.scene.render());
    }
}