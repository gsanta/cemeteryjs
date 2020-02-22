import { RendererController } from './RendererController';
import { ConverterService } from "../../game/import/ConverterService";
import { GameFacade } from "../../game/GameFacade";
import { MeshObject } from "../../game/models/objects/MeshObject";

export class WebglCanvasImporter {
    private webglEditorController: RendererController;
    private gameFacade: GameFacade;


    constructor(webglEditorController: RendererController, gameFacade: GameFacade) {
        this.gameFacade = gameFacade;
        this.webglEditorController = webglEditorController;
    }

    import(file: string): void {
        this.webglEditorController.getGameFacade().clear();

        const converterService = new ConverterService();
        const that = this;

        this.gameFacade.generateWorld(file)
            .then(gameObjects => converterService.convert(
                    gameObjects,
                    {
                        convert(worldItem: MeshObject): any {
                            that.webglEditorController.meshes.push(that.webglEditorController.getGameFacade().meshStore.getMesh(worldItem.meshName));
                        },
                        addChildren(parent: any, children: any[]): void {},
                        addBorders(item: any, borders: any[]): void {},
                        done() {
                            that.webglEditorController.renderWindow();
                        }
                    }    
                )
            )
            .catch(e => console.log(e));
    }
}