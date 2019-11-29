import { ICanvasController } from './canvases/ICanvasController';
import { IEditableCanvas } from './canvases/IEditableCanvas';
import { SvgCanvasController } from './canvases/svg/SvgCanvasController';
import { TextCanvasController } from './canvases/text/TextCanvasController';
import { WebglCanvasController } from './canvases/webgl/WebglCanvasController';
import { EventDispatcher } from './events/EventDispatcher';
import { SettingsForm } from './forms/SettingsForm';
import { SettingsModel } from './forms/SettingsModel';
import { UIUpdateController } from './UIUpdateController';
import { WorldItemDefinitionForm } from './forms/WorldItemDefinitionForm';

export class ControllerFacade {
    webglCanvasController: WebglCanvasController;
    updateUIController: UIUpdateController;
    settingsController: SettingsForm;
    
    worldItemDefinitionForm: WorldItemDefinitionForm;
    settingsModel: SettingsModel;
    editors: IEditableCanvas[];

    eventDispatcher: EventDispatcher;

    constructor() {
        this.eventDispatcher = new EventDispatcher();
        this.editors = [new TextCanvasController(this), new SvgCanvasController(this)];
        this.settingsModel = new SettingsModel();
        
        this.updateUIController = new UIUpdateController();
        this.webglCanvasController = new WebglCanvasController(this);
        this.settingsController = new SettingsForm(this);

        this.worldItemDefinitionForm = new WorldItemDefinitionForm();

    }

    getCanvasControllerById(id: string): ICanvasController {
        return this.editors.find(editor => editor.getId() === id);
    }

    getActiveCanvas(): IEditableCanvas {
        return <IEditableCanvas> this.settingsModel.activeEditor;
    }
}