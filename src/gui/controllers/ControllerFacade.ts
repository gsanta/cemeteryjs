import { WorldItemDefinitionController } from './WorldItemDefinitionController';
import { UIUpdateController } from './UIUpdateController';
import { TextEditorController } from './TextEditorController';
import { WorldMapController } from './WorldMapController';
import { RendererController } from './RendererController';
import { defaultWorldItemDefinitions } from '../configs/defaultWorldItemDefinitions';
import { WindowController } from './WindowController';
import { BitmapEditor } from './bitmap_editor/BitmapEditor';
import { WorldItemDefinitionModel } from '../models/WorldItemDefinitionModel';
import { WindowModel } from '../models/WindowModel';

export class ControllerFacade {
    textEditorController: TextEditorController;
    bitmapEditor: BitmapEditor;
    worldMapController: WorldMapController;
    worldItemDefinitionController: WorldItemDefinitionController;
    updateUIController: UIUpdateController;
    rendererController: RendererController;
    windowController: WindowController;

    worldItemDefinitionModel: WorldItemDefinitionModel;
    windowModel: WindowModel;

    constructor() {
        this.worldItemDefinitionModel = new WorldItemDefinitionModel(defaultWorldItemDefinitions);
        this.windowModel = new WindowModel();
        
        this.textEditorController = new TextEditorController(this);
        this.bitmapEditor = new BitmapEditor(this);
        this.worldItemDefinitionController = new WorldItemDefinitionController(this);
        this.updateUIController = new UIUpdateController();
        this.worldMapController = new WorldMapController(this);
        this.rendererController = new RendererController();
        this.windowController = new WindowController(this);
    }
}