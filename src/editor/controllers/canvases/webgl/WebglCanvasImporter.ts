import { ICanvasImporter } from "../ICanvasImporter";
import { WebglCanvasController } from './WebglCanvasController';
import { FileFormat } from '../../../../WorldGenerator';
import { GameObject } from "../../../../world_generator/services/GameObject";
import { ConverterService } from "../../../../world_generator/services/ConverterService";
import { CreateMeshModifier } from "../../../../world_generator/modifiers/CreateMeshModifier";
import { WorldGeneratorServices } from "../../../../world_generator/services/WorldGeneratorServices";

export class WebglCanvasWriter implements ICanvasImporter {
    private webglEditorController: WebglCanvasController;

    private createMeshModifier: CreateMeshModifier;


    constructor(webglEditorController: WebglCanvasController) {
        this.createMeshModifier = new CreateMeshModifier(webglEditorController.scene, webglEditorController.modelLoader);
        this.webglEditorController = webglEditorController;
    }

    import(file: string): void {
        const serviceFacade = new WorldGeneratorServices(
            this.webglEditorController.modelLoader,
            this.createMeshModifier,
            FileFormat.SVG
        );

        const converterService = new ConverterService();
        const that = this;

        serviceFacade.generateWorld(file)
            .then(gameObjects => converterService.convert(
                    gameObjects,
                    {
                        convert(worldItem: GameObject): any {
                            that.webglEditorController.meshes.push(worldItem.mesh);
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