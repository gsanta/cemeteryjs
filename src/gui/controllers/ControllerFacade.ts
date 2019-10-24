import { TextEditorController } from './TextEditorController';
import { MonacoConfig } from '../views/MonacoConfig';
import { DefinitionController } from './DefinitionController';
import { RenderController } from './RenderController';


export class ControllerFacade {
    textEditorController: TextEditorController;
    definitionController: DefinitionController;
    renderController: RenderController;

    constructor() {
        this.textEditorController = new TextEditorController(MonacoConfig);
        this.definitionController = new DefinitionController(this);
        this.renderController = new RenderController();
    }
}