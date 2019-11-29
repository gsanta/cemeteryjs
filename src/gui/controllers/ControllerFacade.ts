import { ICanvasController } from './canvases/ICanvasController';
import { IEditableCanvas } from './canvases/IEditableCanvas';
import { SvgCanvasController } from './canvases/svg/SvgCanvasController';
import { TextCanvasController } from './canvases/text/TextCanvasController';
import { WebglCanvasController } from './canvases/webgl/WebglCanvasController';
import { EventDispatcher } from './events/EventDispatcher';
import { SettingsController } from './settings/SettingsController';
import { SettingsModel } from './settings/SettingsModel';
import { UIUpdateController } from './UIUpdateController';
import { WorldItemDefinitionForm } from './world_items/WorldItemDefinitionForm';

export class ControllerFacade {
    webglCanvasController: WebglCanvasController;
    updateUIController: UIUpdateController;
    settingsController: SettingsController;
    
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
        this.settingsController = new SettingsController(this);

        this.worldItemDefinitionForm = new WorldItemDefinitionForm();

    }

    getCanvasControllerById(id: string): ICanvasController {
        return this.editors.find(editor => editor.getId() === id);
    }

    getActiveCanvas(): IEditableCanvas {
        return <IEditableCanvas> this.settingsModel.activeEditor;
    }
}