import { TextEditorService } from '../gui_services/TextEditorService';
import { MonacoConfig } from '../gui_models/MonacoConfig';
import { DefinitionService } from '../gui_services/DefinitionService';
import { RenderController } from './RenderController';


export class ControllerFacade {
    textEditorService: TextEditorService;
    definitionService: DefinitionService;
    renderController: RenderController;

    constructor() {
        this.textEditorService = new TextEditorService(MonacoConfig);
        this.definitionService = new DefinitionService(this);
        this.renderController = new RenderController();
    }
}