import { WorldItemTypeController } from './WorldItemTypeController';
import { RenderController } from './RenderController';
import { TextEditorController } from './TextEditorController';
import { WorldMapController } from './WorldMapController';
import { CanvasController } from './CanvasController';
import { defaultWorldItemTypes } from '../configs/defaultWorldItemTypes';
import { WindowController } from './WindowController';
import { BitmapEditor } from './bitmap_editor/BitmapEditor';
import { WorldItemTypeModel } from '../models/WorldItemTypeModel';
import { WindowModel } from '../models/WindowModel';

export class ControllerFacade {
    textEditorController: TextEditorController;
    bitmapEditor: BitmapEditor;
    worldMapController: WorldMapController;
    worldItemTypeController: WorldItemTypeController;
    renderController: RenderController;
    canvasController: CanvasController;
    windowController: WindowController;

    worldItemTypeModel: WorldItemTypeModel;
    windowModel: WindowModel;

    constructor() {
        this.worldItemTypeModel = new WorldItemTypeModel(defaultWorldItemTypes);
        this.windowModel = new WindowModel();
        
        this.textEditorController = new TextEditorController(this);
        this.bitmapEditor = new BitmapEditor(this);
        this.worldItemTypeController = new WorldItemTypeController(this);
        this.renderController = new RenderController();
        this.worldMapController = new WorldMapController(this);
        this.canvasController = new CanvasController(this);
        this.windowController = new WindowController(this);
    }
}