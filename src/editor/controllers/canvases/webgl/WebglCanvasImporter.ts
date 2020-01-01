import { ICanvasImporter } from "../ICanvasImporter";
import { WebglCanvasController } from './WebglCanvasController';
import { GameObject } from "../../../../world_generator/services/GameObject";
import { ConverterService } from "../../../../world_generator/services/ConverterService";
import { CreateMeshModifier } from "../../../../world_generator/modifiers/CreateMeshModifier";
import { WorldGeneratorFacade } from "../../../../world_generator/WorldGeneratorFacade";

export class WebglCanvasWriter implements ICanvasImporter {
    private webglEditorController: WebglCanvasController;

    private createMeshModifier: CreateMeshModifier;


    constructor(webglEditorController: WebglCanvasController) {
        this.createMeshModifier = new CreateMeshModifier(webglEditorController.scene, webglEditorController.gameFacade);
        this.webglEditorController = webglEditorController;
    }

    import(file: string): void {
        this.webglEditorController.gameFacade.clear();

        const serviceFacade = new WorldGeneratorFacade(this.webglEditorController.gameFacade, this.createMeshModifier);
        const converterService = new ConverterService();
        const that = this;

        serviceFacade.generateWorld(file)
            .then(gameObjects => converterService.convert(
                    gameObjects,
                    {
                        convert(worldItem: GameObject): any {
                            that.webglEditorController.meshes.push(that.webglEditorController.gameFacade.meshStore.getMesh(worldItem.meshName));
                        },
                        addChildren(parent: any, children: any[]): void {},
                        addBorders(item: any, borders: any[]): void {},
                        done() {
                            that.webglEditorController.renderCanvas();
                        }
                    }    
                )
            )
            .catch(e => console.log(e));
    }
}