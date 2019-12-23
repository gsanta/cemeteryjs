import { ArcRotateCamera, Color3, Engine, HemisphericLight, Scene, Vector3, UniversalCamera, Mesh } from "babylonjs";
import { FileFormat } from '../../../../WorldGenerator';
import { ControllerFacade } from '../../ControllerFacade';
import { Events } from "../../events/Events";
import { IWritableCanvas } from '../IWritableCanvas';
import { WebglCanvasWriter } from './WebglCanvasWriter';
import { CustomCameraInput } from './CustomCameraInput';
import { MouseCameraInput } from './MouseCameraInput';
import { ModelLoader } from '../../../../world_generator/services/ModelLoader';
(<any> window).earcut = require('earcut');

export class WebglCanvasController implements IWritableCanvas {
    static id = 'webgl-editor';
    fileFormats = [FileFormat.TEXT, FileFormat.SVG];

    engine: Engine;
    scene: Scene;
    writer: WebglCanvasWriter;
    modelLoader: ModelLoader;

    private canvas: HTMLCanvasElement;
    private camera: UniversalCamera;
    private controllers: ControllerFacade;
    private renderCanvasFunc: () => void;
    meshes: Mesh[] = [];

    constructor(controllers: ControllerFacade) {
        this.controllers = controllers;
        this.updateCanvas = this.updateCanvas.bind(this);
        this.registerEvents();
    }

    registerEvents() {
        this.controllers.eventDispatcher.addEventListener(Events.CONTENT_CHANGED, this.updateCanvas);
        this.controllers.eventDispatcher.addEventListener(Events.CANVAS_ITEM_CHANGED, this.updateCanvas);
    }

    unregisterEvents() {
        this.controllers.eventDispatcher.removeEventListener(this.updateCanvas);
    }

    resize() {}

    init(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        
        
        this.engine = new Engine(this.canvas, true, { preserveDrawingBuffer: true, stencil: true });
        
        let cameraPos = new Vector3(0, 30, 30);
        let target = new Vector3(0, 0, 0);
        if (this.camera) {
            cameraPos = this.camera.position;
            target = this.camera.getTarget();
        }
        
        const scene = new Scene(this.engine);
        
        this.camera = new UniversalCamera('camera1', cameraPos, scene);
        this.camera.setTarget(target);
        this.camera.inputs.clear();
        this.camera.inputs.add(new CustomCameraInput());
        this.camera.inputs.add(new MouseCameraInput());
        this.camera.attachControl(this.canvas, true);
        
        const light = new HemisphericLight('light', new Vector3(0, 4, 1), scene);
        light.diffuse = new Color3(1, 1, 1);
        light.intensity = 1
        
        this.scene = scene;
        
        this.modelLoader = new ModelLoader(this.scene);
        this.writer = new WebglCanvasWriter(this);
        

        this.updateCanvas();
    }

    updateCanvas() {
        if (!this.canvas) { return; }

        this.clearCanvas();
        if (this.writer) {
            const file = this.controllers.svgCanvasController.reader.read();
            this.writer.write(file);
        }

        this.renderCanvas();
    }


    getId(): string {
        return WebglCanvasController.id;
    }

    setCanvasRenderer(renderFunc: () => void) {
        this.renderCanvasFunc = renderFunc;
    }

    renderCanvas() {
        this.engine.runRenderLoop(() => this.scene.render());
        this.renderCanvasFunc();
    }

    activate(): void {}

    private clearCanvas() {
        this.meshes.forEach(mesh => {
            if (mesh) {
                this.scene.removeMesh(mesh);
                mesh.dispose():
            }
        });
        this.meshes = [];
    }
}