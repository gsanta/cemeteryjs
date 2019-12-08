import { ArcRotateCamera, Color3, Engine, HemisphericLight, Scene, Vector3, FreeCamera, UniversalCamera } from "babylonjs";
import { FileFormat } from '../../../../WorldGenerator';
import { ControllerFacade } from '../../ControllerFacade';
import { Events } from "../../events/Events";
import { IWritableCanvas } from '../IWritableCanvas';
import { WebglCanvasWriter } from './WebglCanvasWriter';
import { CustomCameraInput } from './CustomCameraInput';
import { MouseCameraInput } from './MouseCameraInput';
(<any> window).earcut = require('earcut');

export class WebglCanvasController implements IWritableCanvas {
    static id = 'webgl-editor';
    fileFormats = [FileFormat.TEXT, FileFormat.SVG];

    engine: Engine;
    scene: Scene;
    writer: WebglCanvasWriter;
    isDirty: boolean;

    private canvas: HTMLCanvasElement;
    private camera: UniversalCamera;
    private controllers: ControllerFacade;
    private renderCanvasFunc: () => void;

    constructor(controllers: ControllerFacade) {
        this.controllers = controllers;
        this.updateContent = this.updateContent.bind(this);
        this.registerEvents();
    }
    ArcRotateCamera
    registerEvents() {
        this.controllers.eventDispatcher.addEventListener(Events.CONTENT_CHANGED, this.updateContent);
        this.controllers.eventDispatcher.addEventListener(Events.CANVAS_ITEM_CHANGED, this.updateContent);
    }

    unregisterEvents() {
        this.controllers.eventDispatcher.removeEventListener(this.updateContent);
    }

    resize() {}

    init(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
        this.writer = new WebglCanvasWriter(this, this.controllers.getActiveCanvas().worldItemDefinitions);
    }

    updateCanvas(worldMap: string, fileFormat: FileFormat) {
        this.updateContent();
        // this.clearCanvas();

        // const that = this;

        // new BabylonWorldGenerator(this.scene).generate(worldMap, fileFormat, {
        //     convert(worldItem: WorldItem): any {
        //         if (worldItem.name === 'wall' && worldItem.children.length > 0) {
        //             worldItem.meshTemplate.meshes[0].isVisible = false;
        //         }
        //     },
        //     addChildren(parent: any, children: any[]): void {},
        //     addBorders(item: any, borders: any[]): void {},
        //     done() {
        //         this.engine.runRenderLoop(() => this.scene.render());
        //         that.updateContent();
        //     }
        // });
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

    private updateContent() {
        this.clearCanvas();
        if (this.writer) {
            const file = this.controllers.settingsModel.activeEditor.reader.read();
            this.writer.write(file, this.controllers.settingsModel.activeEditor.fileFormats[0]);
        }
    }

    private clearCanvas() {
        const scene = new Scene(this.engine);

        // const alpha = this.camera ? this.camera.alpha : 0;
        // const beta = this.camera ? this.camera.beta : 0;
        // const radius = this.camera ? this.camera.radius : 40;
        // const target = this.camera ? this.camera.target : new Vector3(0, 0, 0);
        // const position = this.camera ? this.camera.position : new Vector3(0, 40, 20);
        // this.camera = new ArcRotateCamera("Camera", alpha, beta, radius, target, scene);
        this.camera = new UniversalCamera('camera1', new Vector3(0, 50, 20), scene);
        this.camera.setTarget(new Vector3(0, 0, 0));
        this.camera.inputs.clear();
        this.camera.inputs.add(new CustomCameraInput());
        this.camera.inputs.add(new MouseCameraInput());
        this.camera.attachControl(this.canvas, true);
        // this.camera.keysUp.push(38);    //W
        // this.camera.keysDown.push(40)   //D
        // this.camera.keysLeft.push(37);  //A
        // this.camera.keysRight.push(39); //S


        // this.camera.setPosition(position);
        // this.camera.attachControl(this.canvas, true);

        const light = new HemisphericLight('light', new Vector3(0, 4, 1), scene);
        light.diffuse = new Color3(1, 1, 1);
        light.intensity = 1

        const engine = this.engine;
        this.scene = scene;
    }
}