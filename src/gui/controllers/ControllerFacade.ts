import { WorldItemDefinitionController } from './WorldItemDefinitionController';
import { RenderController } from './RenderController';
import { TextEditorController } from './TextEditorController';
import { WorldMapController } from './WorldMapController';
import { CanvasController } from './CanvasController';
import { defaultWorldItemDefinitions } from '../configs/defaultWorldItemDefinitions';
import { WindowController } from './WindowController';
import { BitmapEditor } from './bitmap_editor/BitmapEditor';
import { WorldItemDefinitionModel } from '../models/WorldItemDefinitionModel';
import { WindowModel } from '../models/WindowModel';

export class ControllerFacade {
    textEditorController: TextEditorController;
    bitmapEditor: BitmapEditor;
    worldMapController: WorldMapController;
    worldItemTypeController: WorldItemDefinitionController;
    renderController: RenderController;
    canvasController: CanvasController;
    windowController: WindowController;

    worldItemTypeModel: WorldItemDefinitionModel;
    windowModel: WindowModel;

    constructor() {
        this.worldItemTypeModel = new WorldItemDefinitionModel(defaultWorldItemDefinitions);
        this.windowModel = new WindowModel();
        
        this.textEditorController = new TextEditorController(this);
        this.bitmapEditor = new BitmapEditor(this);
        this.worldItemTypeController = new WorldItemDefinitionController(this);
        this.renderController = new RenderController();
        this.worldMapController = new WorldMapController(this);
        this.canvasController = new CanvasController(this);
        this.windowController = new WindowController(this);
    }
}