import { WorldItemDefinitionController } from './world_items/WorldItemDefinitionController';
import { UIUpdateController } from './UIUpdateController';
import { TextEditorController } from './editors/text/TextEditorController';
import { RendererController } from './RendererController';
import { defaultWorldItemDefinitions } from '../configs/defaultWorldItemDefinitions';
import { SettingsController } from './settings/SettingsController';
import { BitmapEditorController } from './editors/bitmap/BitmapEditorController';
import { WorldItemDefinitionModel } from './world_items/WorldItemDefinitionModel';
import { SettingsModel } from './settings/SettingsModel';
import { IEditorController } from './editors/IEditorController';
import { TextEditorModel } from './editors/text/TextEditorModel';

export class ControllerFacade {
    textEditorController: TextEditorController;
    bitmapEditorController: BitmapEditorController;
    worldItemDefinitionController: WorldItemDefinitionController;
    updateUIController: UIUpdateController;
    rendererController: RendererController;
    settingsController: SettingsController;

    worldItemDefinitionModel: WorldItemDefinitionModel;
    settingsModel: SettingsModel;
    textEditorModel: TextEditorModel;
    bitmapEditorModel: TextEditorModel;
    editors: IEditorController[];

    constructor() {
        this.worldItemDefinitionModel = new WorldItemDefinitionModel(defaultWorldItemDefinitions);
        this.settingsModel = new SettingsModel();
        this.textEditorModel = new TextEditorModel();
        this.bitmapEditorModel = null;
        
        this.textEditorController = new TextEditorController(this);
        this.bitmapEditorController = new BitmapEditorController(this);
        this.worldItemDefinitionController = new WorldItemDefinitionController(this);
        this.updateUIController = new UIUpdateController();
        this.rendererController = new RendererController();
        this.settingsController = new SettingsController(this);
        this.editors = [this.textEditorController, this.bitmapEditorController];
    }
}