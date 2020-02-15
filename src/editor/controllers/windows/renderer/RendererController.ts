import { Color3, Engine, HemisphericLight, Mesh, MeshBuilder, Scene, UniversalCamera, Vector3 } from 'babylonjs';
import { AbstractModelLoader } from '../../../../common/AbstractModelLoader';
import { GameFacade } from '../../../../game/GameFacade';
import { FileFormat } from '../../../../game/import/WorldGenerator';
import { Controllers } from '../../Controllers';
import { Events } from "../../events/Events";
import { EditorCamera } from './EditorCamera';
import { HelperMeshes } from './HelperMeshes';
import { WebglCanvasWriter } from './WebglCanvasImporter';
import { CanvasViewSettings, AbstractCanvasController } from '../AbstractCanvasController';
import { RendererCameraTool } from './RendererCameraTool';
import { Tool } from '../canvas/tools/Tool';
import { WindowController } from '../WindowController';
import { ITagService } from '../ITagService';
import { MouseHandler } from '../services/MouseHandler';
(<any> window).earcut = require('earcut');

export class RendererController extends AbstractCanvasController implements WindowController {
    name = '3D View';
    static id = 'webgl-editor';
    visible = true;
    fileFormats = [FileFormat.TEXT, FileFormat.SVG];

    mouseHander: MouseHandler;

    engine: Engine;
    scene: Scene;
    gameFacade: GameFacade;
    writer: WebglCanvasWriter;
    modelLoader: AbstractModelLoader;
    tagService: ITagService;
    private helperMeshes: HelperMeshes;

    private canvas: HTMLCanvasElement;
    camera: EditorCamera;
    cameraTool: RendererCameraTool;
    activeTool: Tool;

    private controllers: Controllers;
    private renderCanvasFunc: () => void;
    meshes: Mesh[] = [];

    constructor(controllers: Controllers) {
        super();
        this.controllers = controllers;
        this.mouseHander = new MouseHandler(this);
        this.updateCanvas = this.updateCanvas.bind(this);
        this.registerEvents();
    }

    getCamera(): EditorCamera {
        return this.cameraTool.getCamera();
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
        this.cameraTool = new RendererCameraTool(this, this.camera);
        this.activeTool = this.cameraTool;
        

        this.helperMeshes = new HelperMeshes(this.controllers, scene, MeshBuilder);
        const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);
        // light.radius = 300;
        
        light.diffuse = new Color3(1, 1, 1);
        light.specular = new Color3(0, 0, 0);
        const lightMesh = MeshBuilder.CreateBox('light-cube', {size: 1}, scene);
        lightMesh.translate(new Vector3(5, 200, 0), 1);
        // light.diffuse = new Color3(1, 1, 1);
        // light.intensity = 1;
        

        // const light2 = new HemisphericLight('light2', new Vector3(0, 10, 0), scene);
        // light2.diffuse = new Color3(1, 1, 1);
        // light2.intensity = 1;

        this.scene = scene;
        
        this.gameFacade = new GameFacade(this.scene);
        this.gameFacade.setup();
        this.writer = new WebglCanvasWriter(this, this.gameFacade);
        

        this.updateCanvas();
    }

    updateCanvas() {
        if (!this.canvas) { return; }

        this.clearCanvas();
        if (this.writer) {
            const file = this.controllers.svgCanvasController.reader.export();
            this.writer.import(file);
        }

        this.renderWindow();
    }


    getId(): string {
        return RendererController.id;
    }

    getActiveTool(): Tool {
        return this.activeTool;
    }

    setCanvasRenderer(renderFunc: () => void) {
        this.renderCanvasFunc = renderFunc;
    }

    renderWindow() {
        this.engine.runRenderLoop(() => this.scene.render());
        this.renderCanvasFunc();
    }

    setVisible(visible: boolean) {
        this.visible = visible;
        if (!this.visible) { this.controllers.svgCanvasController.setVisible(true);}
        this.controllers.render();
    }

    isVisible(): boolean {
        return this.visible;
    }

    activate(): void {}

    private clearCanvas() {
        this.gameFacade.clear();
    }

    
    viewSettings: CanvasViewSettings = {
        initialSizePercent: 44,
        minSizePixel: 300
    }
}