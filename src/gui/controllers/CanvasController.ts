import { ControllerFacade } from "./ControllerFacade";
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, Color3 } from "babylonjs";
import { BabylonWorldGenerator } from "../../integrations/babylonjs/BabylonWorldGenerator";
import { WorldItem } from "../../WorldItem";
(<any> window).earcut = require('earcut');

export class CanvasController {
    private controllers: ControllerFacade;
    engine: Engine;
    private canvas: HTMLCanvasElement;

    constructor(controllers: ControllerFacade) {
        this.controllers = controllers;
    }

    init(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
    }

    updateCanvas(worldMap: string) {
        const scene = new Scene(this.engine);
        const camera = new ArcRotateCamera("Camera", 0, 0, 40, new Vector3(0, 0, 0), scene);
        camera.setPosition(new Vector3(0, 40, 20));
        camera.attachControl(this.canvas, true);

        const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);
        light.diffuse = new Color3(1, 1, 1);
        light.intensity = 1;

        const engine = this.engine;

        new BabylonWorldGenerator(scene).generate(worldMap, {
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
}