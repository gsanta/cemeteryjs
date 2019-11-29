import { ICanvasWriter } from "../ICanvasWriter";
import { WebglCanvasController } from './WebglCanvasController';
import { WorldItemDefinitionModel } from "../../world_items/WorldItemDefinitionModel";
import { BabylonWorldGenerator } from "../../../../integrations/babylonjs/BabylonWorldGenerator";
import { FileFormat } from '../../../../WorldGenerator';
import { WorldItem } from "../../../../WorldItem";
import { WorldItemDefinition } from '../../../../WorldItemDefinition';

export class WebglCanvasWriter implements ICanvasWriter {
    private webglEditorController: WebglCanvasController;
    private worldItemDefinitions: WorldItemDefinition[];

    constructor(webglEditorController: WebglCanvasController, worldItemDefinitions: WorldItemDefinition[]) {
        this.webglEditorController = webglEditorController;
        this.worldItemDefinitions = worldItemDefinitions;
    }

    write(file: string, fileFormat: FileFormat): void {
        const that = this;
        new BabylonWorldGenerator(this.webglEditorController.scene).generate(file, fileFormat, {
            convert(worldItem: WorldItem): any {
                if (worldItem.name === 'wall' && worldItem.children.length > 0) {
                    worldItem.meshTemplate.meshes[0].isVisible = false;
                }
            },
            addChildren(parent: any, children: any[]): void {},
            addBorders(item: any, borders: any[]): void {},
            done() {
                // this.webglEditorController.engine.runRenderLoop(() => this.webglEditorController.scene.render());
                that.webglEditorController.render();
            }
        });
    }
}