import { TextEditorService } from './TextEditorService';
import { MonacoConfig } from '../gui_models/MonacoConfig';


export class GuiServiceFacade {
    textEditorService: TextEditorService;

    constructor() {
        this.textEditorService = new TextEditorService(MonacoConfig);
    }
}