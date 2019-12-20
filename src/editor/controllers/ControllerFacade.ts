import { ICanvasController } from './formats/ICanvasController';
import { IEditableCanvas } from './formats/IEditableCanvas';
import { SvgCanvasController } from './formats/svg/SvgCanvasController';
import { WebglCanvasController } from './formats/webgl/WebglCanvasController';
import { EventDispatcher } from './events/EventDispatcher';
import { WorldItemDefinitionForm } from './forms/WorldItemDefinitionForm';

export class ControllerFacade {
    webglCanvasController: WebglCanvasController;
    svgCanvasController: SvgCanvasController;
    
    worldItemDefinitionForm: WorldItemDefinitionForm;
    editors: IEditableCanvas[];

    eventDispatcher: EventDispatcher;

    constructor() {
        this.eventDispatcher = new EventDispatcher();
        this.webglCanvasController = new WebglCanvasController(this);
        this.svgCanvasController = new SvgCanvasController(this);

        this.worldItemDefinitionForm = new WorldItemDefinitionForm();

    }
}