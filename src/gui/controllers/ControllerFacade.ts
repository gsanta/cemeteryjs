import { ICanvasController } from './canvases/ICanvasController';
import { IEditableCanvas } from './canvases/IEditableCanvas';
import { SvgCanvasController } from './canvases/svg/SvgCanvasController';
import { WebglCanvasController } from './canvases/webgl/WebglCanvasController';
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