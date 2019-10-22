import { TextEditorService } from './TextEditorService';
import { MonacoConfig } from '../gui_models/MonacoConfig';
import { DefinitionService } from './DefinitionService';


export class GuiServiceFacade {
    textEditorService: TextEditorService;
    definitionService: DefinitionService;

    constructor() {
        this.textEditorService = new TextEditorService(MonacoConfig);
        this.definitionService = new DefinitionService();
    }
}