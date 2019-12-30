import { Engine, Scene } from 'babylonjs';
import { ModelLoader } from '../../../../world_generator/services/ModelLoader';
import { CanvasItem } from './models/SvgCanvasStore';
import { SvgCanvasController } from './SvgCanvasController';


const SCALE = 2;
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
            canvasItem.dimensions = canvasItem.dimensions.setWidth(modelData.dimensions.x / SCALE).setHeight(modelData.dimensions.y / SCALE);
            this.canvasController.renderCanvas();
        });
    }

    private init() {
        this.engine = new Engine(this.canvas, true, { preserveDrawingBuffer: true, stencil: true });
        this.scene = new Scene(this.engine);
    }
}