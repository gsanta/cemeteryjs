import { WorldItemDefinitionForm } from './world_items/WorldItemDefinitionForm';
import { UIUpdateController } from './UIUpdateController';
import { TextCanvasController, initialText } from './canvases/text/TextCanvasController';
import { WebglCanvasController } from './canvases/webgl/WebglCanvasController';
import { defaultWorldItemDefinitions } from '../configs/defaultWorldItemDefinitions';
import { SettingsController } from './settings/SettingsController';
import { SvgCanvasController, initialSvg } from './canvases/svg/SvgCanvasController';
import { WorldItemDefinitionModel } from './world_items/WorldItemDefinitionModel';
import { SettingsModel } from './settings/SettingsModel';
import { TextCanvasReader } from './canvases/text/TextCanvasReader';
import { IEditableCanvas } from './canvases/IEditableCanvas';
import { EventDispatcher } from './events/EventDispatcher';
import { ICanvasController } from './canvases/ICanvasController';

export class ControllerFacade {
    textEditorController: TextCanvasController;
    bitmapEditorController: SvgCanvasController;
    webglEditorController: WebglCanvasController;
    updateUIController: UIUpdateController;
    settingsController: SettingsController;
    
    settingsModel: SettingsModel;
    textEditorModel: TextCanvasReader;
    bitmapEditorModel: TextCanvasReader;
    editors: IEditableCanvas[];
    eventDispatcher: EventDispatcher;

    constructor() {
        this.eventDispatcher = new EventDispatcher();
        // this.worldItemDefinitionModel = new WorldItemDefinitionModel(defaultWorldItemDefinitions);
        this.settingsModel = new SettingsModel();
        this.bitmapEditorModel = null;
        
        this.textEditorController = new TextCanvasController(this);
        this.bitmapEditorController = new SvgCanvasController(this);
        // this.worldItemDefinitionController = new WorldItemDefinitionController(this);
        this.updateUIController = new UIUpdateController();
        this.webglEditorController = new WebglCanvasController(this);
        this.settingsController = new SettingsController(this);

        // this.bitmapEditorController.writer.write(initialSvg, FileFormat.SVG);
        this.editors = [this.textEditorController, this.bitmapEditorController];
        // this.textEditorController.writer.write(initialText, FileFormat.TEXT);
    }

    getCanvasControllerById(id: string): ICanvasController {
        return this.editors.find(editor => editor.getId() === id);
    }

    getActiveCanvas(): IEditableCanvas {
        return <IEditableCanvas> this.settingsModel.activeEditor;
    }
}