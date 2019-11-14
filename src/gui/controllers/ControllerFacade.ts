import { WorldItemDefinitionController } from './world_items/WorldItemDefinitionController';
import { UIUpdateController } from './UIUpdateController';
import { TextEditorController, initialText } from './editors/text/TextEditorController';
import { WebglEditorController } from './editors/webgl/WebglEditorController';
import { defaultWorldItemDefinitions } from '../configs/defaultWorldItemDefinitions';
import { SettingsController } from './settings/SettingsController';
import { SvgEditorController, initialSvg } from './editors/svg/SvgEditorController';
import { WorldItemDefinitionModel } from './world_items/WorldItemDefinitionModel';
import { SettingsModel } from './settings/SettingsModel';
import { IEditorController } from './editors/IEditorController';
import { TextEditorReader } from './editors/text/TextEditorReader';
import { FileFormat } from '../../WorldGenerator';

export class ControllerFacade {
    textEditorController: TextEditorController;
    bitmapEditorController: SvgEditorController;
    worldItemDefinitionController: WorldItemDefinitionController;
    updateUIController: UIUpdateController;
    rendererController: WebglEditorController;
    settingsController: SettingsController;

    worldItemDefinitionModel: WorldItemDefinitionModel;
    settingsModel: SettingsModel;
    textEditorModel: TextEditorReader;
    bitmapEditorModel: TextEditorReader;
    editors: IEditorController[];

    constructor() {
        this.worldItemDefinitionModel = new WorldItemDefinitionModel(defaultWorldItemDefinitions);
        this.settingsModel = new SettingsModel();
        this.bitmapEditorModel = null;
        
        this.textEditorController = new TextEditorController(this);
        this.bitmapEditorController = new SvgEditorController(this);
        this.worldItemDefinitionController = new WorldItemDefinitionController(this);
        this.updateUIController = new UIUpdateController();
        this.rendererController = new WebglEditorController();
        this.settingsController = new SettingsController(this);

        this.bitmapEditorController.writer.write(initialSvg, FileFormat.SVG);
        this.textEditorController.writer.write(initialText, FileFormat.TEXT);
        this.editors = [this.textEditorController, this.bitmapEditorController];
    }
}