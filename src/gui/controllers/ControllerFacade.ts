import { WorldItemDefinitionController } from './WorldItemDefinitionController';
import { UIUpdateController } from './UIUpdateController';
import { TextEditorController } from './editors/text/TextEditorController';
import { WorldMapController } from './WorldMapController';
import { RendererController } from './RendererController';
import { defaultWorldItemDefinitions } from '../configs/defaultWorldItemDefinitions';
import { SettingsController } from './settings/SettingsController';
import { BitmapEditorController } from './editors/bitmap/BitmapEditorController';
import { WorldItemDefinitionModel } from './WorldItemDefinitionModel';
import { SettingsModel } from './settings/SettingsModel';

export class ControllerFacade {
    textEditorController: TextEditorController;
    bitmapEditorController: BitmapEditorController;
    worldMapController: WorldMapController;
    worldItemDefinitionController: WorldItemDefinitionController;
    updateUIController: UIUpdateController;
    rendererController: RendererController;
    settingsController: SettingsController;

    worldItemDefinitionModel: WorldItemDefinitionModel;
    settingsModel: SettingsModel;

    constructor() {
        this.worldItemDefinitionModel = new WorldItemDefinitionModel(defaultWorldItemDefinitions);
        this.settingsModel = new SettingsModel();
        
        this.textEditorController = new TextEditorController(this);
        this.bitmapEditorController = new BitmapEditorController(this);
        this.worldItemDefinitionController = new WorldItemDefinitionController(this);
        this.updateUIController = new UIUpdateController();
        this.worldMapController = new WorldMapController(this);
        this.rendererController = new RendererController();
        this.settingsController = new SettingsController(this);
    }
}