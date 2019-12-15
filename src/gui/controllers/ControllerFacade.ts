import { ICanvasController } from './canvases/ICanvasController';
import { IEditableCanvas } from './canvases/IEditableCanvas';
import { SvgCanvasController } from './canvases/svg/SvgCanvasController';
import { WebglCanvasController } from './canvases/webgl/WebglCanvasController';
import { EventDispatcher } from './events/EventDispatcher';
import { UIUpdateController } from './UIUpdateController';
import { WorldItemDefinitionForm } from './forms/WorldItemDefinitionForm';

export class ControllerFacade {
    webglCanvasController: WebglCanvasController;
    svgCanvasController: SvgCanvasController;
    updateUIController: UIUpdateController;
    
    worldItemDefinitionForm: WorldItemDefinitionForm;
    editors: IEditableCanvas[];

    eventDispatcher: EventDispatcher;

    constructor() {
        this.eventDispatcher = new EventDispatcher();
        this.updateUIController = new UIUpdateController();
        this.webglCanvasController = new WebglCanvasController(this);
        this.svgCanvasController = new SvgCanvasController(this);

        this.worldItemDefinitionForm = new WorldItemDefinitionForm();

    }
}