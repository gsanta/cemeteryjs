import { DefinitionController } from './DefinitionController';
import { RenderController } from './RenderController';
import { TextEditorController } from './TextEditorController';
import { WorldMapController } from './WorldMapController';
import { CanvasController } from './CanvasController';


export class ControllerFacade {
    textEditorController: TextEditorController;
    worldMapController: WorldMapController;
    definitionController: DefinitionController;
    renderController: RenderController;
    canvasController: CanvasController;

    constructor() {
        this.textEditorController = new TextEditorController();
        this.definitionController = new DefinitionController(this);
        this.renderController = new RenderController();
        this.worldMapController = new WorldMapController(this);
        this.canvasController = new CanvasController(this);
    }
}