import { ArcRotateCamera, Color3, Engine, HemisphericLight, Scene, Vector3 } from "babylonjs";
import { BabylonWorldGenerator } from "../../../../integrations/babylonjs/BabylonWorldGenerator";
import { FileFormat } from '../../../../WorldGenerator';
import { WorldItem } from "../../../../WorldItem";
import { IWritableEditor } from '../IWritableEditor';
import { WebglEditorWriter } from './WebglEditorWriter';
import { ControllerFacade } from '../../ControllerFacade';
import { Events } from "../../events/Events";
(<any> window).earcut = require('earcut');

export class WebglEditorController implements IWritableEditor {
    static id = 'webgl-editor';
    fileFormats = [FileFormat.TEXT, FileFormat.SVG];

    engine: Engine;
    scene: Scene;
    writer: WebglEditorWriter;
    isDirty: boolean;

    private canvas: HTMLCanvasElement;
    private camera: ArcRotateCamera;
    private controllers: ControllerFacade;
    private renderFunc: () => void;

    constructor(controllers: ControllerFacade) {
        this.controllers = controllers;
        this.controllers.eventDispatcher.addEventListener(Events.CONTENT_CHANGED, () => this.updateContent());
    }

    resize() {}

    init(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
        this.writer = new WebglEditorWriter(this, this.controllers.worldItemDefinitionModel);
    }

    updateCanvas(worldMap: string, fileFormat: FileFormat) {
        const scene = new Scene(this.engine);

        const alpha = this.camera ? this.camera.alpha : 0;
        const beta = this.camera ? this.camera.beta : 0;
        const radius = this.camera ? this.camera.radius : 40;
        const target = this.camera ? this.camera.target : new Vector3(0, 0, 0);
        const position = this.camera ? this.camera.position : new Vector3(0, 40, 20);
        this.camera = new ArcRotateCamera("Camera", alpha, beta, radius, target, scene);

        this.camera.setPosition(position);
        this.camera.attachControl(this.canvas, true);

        const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);
        light.diffuse = new Color3(1, 1, 1);
        light.intensity = 1

        const engine = this.engine;
        this.scene = scene;

        new BabylonWorldGenerator(scene).generate(worldMap, fileFormat, {
            convert(worldItem: WorldItem): any {
                if (worldItem.name === 'wall' && worldItem.children.length > 0) {
                    worldItem.meshTemplate.meshes[0].isVisible = false;
                }
            },
            addChildren(parent: any, children: any[]): void {},
            addBorders(item: any, borders: any[]): void {},
            done() {
                engine.runRenderLoop(() => scene.render());
            }
        });
    }


    getId(): string {
        return WebglEditorController.id;
    }

    setRenderer(renderFunc: () => void) {
        this.renderFunc = renderFunc;
    }

    render() {
        this.engine.runRenderLoop(() => this.scene.render());

        // this.renderFunc();
    }

    activate(): void {}

    private updateContent() {
        if (this.writer) {
            const file = this.controllers.settingsModel.activeEditor.reader.read(this.controllers.worldItemDefinitionModel);
            this.writer.write(file, this.controllers.settingsModel.activeEditor.fileFormats[0]);
        }
    }
}