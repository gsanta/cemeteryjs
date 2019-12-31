import { ArcRotateCamera, Color3, Engine, HemisphericLight, Scene, Vector3, UniversalCamera, Mesh, MeshBuilder, DirectionalLight } from 'babylonjs';
import { FileFormat } from '../../../../WorldGenerator';
import { ControllerFacade } from '../../ControllerFacade';
import { Events } from "../../events/Events";
import { IWritableCanvas } from '../IWritableCanvas';
import { WebglCanvasWriter } from './WebglCanvasImporter';
import { KeyboardCameraInput } from './KeyboardCameraInput';
import { MouseCameraInput } from './MouseCameraInput';
import { ModelLoader } from '../../../../world_generator/services/ModelLoader';
import { EditorCamera } from './EditorCamera';
import { HelperMeshes } from './HelperMeshes';
(<any> window).earcut = require('earcut');

export class WebglCanvasController implements IWritableCanvas {
    static id = 'webgl-editor';
    fileFormats = [FileFormat.TEXT, FileFormat.SVG];

    engine: Engine;
    scene: Scene;
    writer: WebglCanvasWriter;
    modelLoader: ModelLoader;
    private helperMeshes: HelperMeshes;

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

    resize() {
        this.engine.resize();
    }

    init(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        
        this.engine = new Engine(this.canvas, true, { preserveDrawingBuffer: true, stencil: true });
        
        let target = new Vector3(100, 0, 0);
        
        const scene = new Scene(this.engine);
        this.camera = new EditorCamera(scene, this.canvas, target);
        

        this.helperMeshes = new HelperMeshes(this.controllers, scene, MeshBuilder);
        const light = new DirectionalLight('light', new Vector3(5, -10, 0), scene);
        light.diffuse = new Color3(1, 1, 1);
        light.intensity = 1;
        

        // const light2 = new HemisphericLight('light2', new Vector3(0, 10, 0), scene);
        // light2.diffuse = new Color3(1, 1, 1);
        // light2.intensity = 1;

        this.scene = scene;
        
        this.modelLoader = new ModelLoader(this.scene);
        this.writer = new WebglCanvasWriter(this);
        

        this.updateCanvas();
    }

    updateCanvas() {
        if (!this.canvas) { return; }

        this.clearCanvas();
        if (this.writer) {
            const file = this.controllers.svgCanvasController.reader.export();
            this.writer.import(file);
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
                this.scene.removeMesh(mesh, true);
            }
        });
        this.meshes = [];
    }
}