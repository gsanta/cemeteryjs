import { TextEditorService } from './TextEditorService';
import { MonacoConfig } from '../gui_models/editor/MonacoConfig';


export class GuiServiceFacade {
    textEditorService: TextEditorService;

    constructor() {
        this.textEditorService = new TextEditorService(MonacoConfig);
    }
}