import { WorldItemDefinitionController } from './world_items/WorldItemDefinitionController';
import { UIUpdateController } from './UIUpdateController';
import { TextEditorController, initialText } from './editors/text/TextEditorController';
import { WebglEditorController } from './editors/webgl/WebglEditorController';
import { defaultWorldItemDefinitions } from '../configs/defaultWorldItemDefinitions';
import { SettingsController } from './settings/SettingsController';
import { SvgEditorController, initialSvg } from './editors/svg/SvgEditorController';
import { WorldItemDefinitionModel } from './world_items/WorldItemDefinitionModel';
import { SettingsModel } from './settings/SettingsModel';
import { TextEditorReader } from './editors/text/TextEditorReader';
import { FileFormat } from '../../WorldGenerator';
import { IReadableWriteableEditor } from './editors/IReadableWriteableEditor';
import { EventDispatcher } from './events/EventDispatcher';

export class ControllerFacade {
    textEditorController: TextEditorController;
    bitmapEditorController: SvgEditorController;
    webglEditorController: WebglEditorController;
    worldItemDefinitionController: WorldItemDefinitionController;
    updateUIController: UIUpdateController;
    settingsController: SettingsController;
    
    worldItemDefinitionModel: WorldItemDefinitionModel;
    settingsModel: SettingsModel;
    textEditorModel: TextEditorReader;
    bitmapEditorModel: TextEditorReader;
    editors: IReadableWriteableEditor[];
    eventDispatcher: EventDispatcher;

    constructor() {
        this.eventDispatcher = new EventDispatcher();
        this.worldItemDefinitionModel = new WorldItemDefinitionModel(defaultWorldItemDefinitions);
        this.settingsModel = new SettingsModel();
        this.bitmapEditorModel = null;
        
        this.textEditorController = new TextEditorController(this);
        this.bitmapEditorController = new SvgEditorController(this);
        this.worldItemDefinitionController = new WorldItemDefinitionController(this);
        this.updateUIController = new UIUpdateController();
        this.webglEditorController = new WebglEditorController(this);
        this.settingsController = new SettingsController(this);

        // this.bitmapEditorController.writer.write(initialSvg, FileFormat.SVG);
        this.editors = [this.textEditorController, this.bitmapEditorController];
        // this.textEditorController.writer.write(initialText, FileFormat.TEXT);
    }
}