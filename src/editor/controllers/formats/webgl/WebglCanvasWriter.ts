import { ICanvasWriter } from "../ICanvasWriter";
import { WebglCanvasController } from './WebglCanvasController';
import { FileFormat, WorldGenerator } from '../../../../WorldGenerator';
import { GameObject } from "../../../../world_generator/services/GameObject";
import { GameObjectTemplate } from '../../../../world_generator/services/GameObjectTemplate';

export class WebglCanvasWriter implements ICanvasWriter {
    private webglEditorController: WebglCanvasController;
    private worldItemDefinitions: GameObjectTemplate[];

    constructor(webglEditorController: WebglCanvasController, worldItemDefinitions: GameObjectTemplate[]) {
    this.webglEditorController = webglEditorController;
        this.worldItemDefinitions = worldItemDefinitions;
    }

    write(file: string): void {
        const that = this;
        new WorldGenerator(this.webglEditorController.scene).generate(
            file,
            {
                convert(worldItem: GameObject): any {
                    if (worldItem.name === 'wall' && worldItem.children.length > 0) {
                        worldItem.meshTemplate.meshes[0].isVisible = false;
                    }
                },
                addChildren(parent: any, children: any[]): void {},
                addBorders(item: any, borders: any[]): void {},
                done() {
                    // this.webglEditorController.engine.runRenderLoop(() => this.webglEditorController.scene.render());
                    that.webglEditorController.renderCanvas();
                }
            },
            FileFormat.SVG
        );
    }
}