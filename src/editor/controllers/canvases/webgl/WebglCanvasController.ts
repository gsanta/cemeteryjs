import { Color3, DirectionalLight, Engine, Mesh, MeshBuilder, Scene, UniversalCamera, Vector3 } from 'babylonjs';
import { AbstractModelLoader } from '../../../../common/AbstractModelLoader';
import { FileFormat } from '../../../../WorldGenerator';
import { EditorFacade } from '../../EditorFacade';
import { Events } from "../../events/Events";
import { IWritableCanvas } from '../IWritableCanvas';
import { EditorCamera } from './EditorCamera';
import { HelperMeshes } from './HelperMeshes';
import { WebglCanvasWriter } from './WebglCanvasImporter';
import { GameFacade } from '../../../../game/GameFacade';
(<any> window).earcut = require('earcut');

export class WebglCanvasController implements IWritableCanvas {
    static id = 'webgl-editor';
    fileFormats = [FileFormat.TEXT, FileFormat.SVG];

    engine: Engine;
    scene: Scene;
    gameFacade: GameFacade;
    writer: WebglCanvasWriter;
    modelLoader: AbstractModelLoader;
    private helperMeshes: HelperMeshes;

    private canvas: HTMLCanvasElement;
    private camera: UniversalCamera;
    private controllers: EditorFacade;
    private renderCanvasFunc: () => void;
    meshes: Mesh[] = [];

    constructor(controllers: EditorFacade) {
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
        
        this.gameFacade = new GameFacade(this.scene);
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