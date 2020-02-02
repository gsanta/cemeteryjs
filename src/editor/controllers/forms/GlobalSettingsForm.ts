import { GameObject } from '../../../world_generator/services/GameObject';
import { SvgCanvasController } from '../canvases/svg/SvgCanvasController';
import { AbstractForm } from './AbstractForm';

export enum GlobalSettingsPropType {
    IMPORT_FILE = 'import file'
}

export class GlobalSettingsForm extends AbstractForm<GlobalSettingsPropType> {
    gameObject: GameObject;

    private canvasController: SvgCanvasController;

    constructor(canvasController: SvgCanvasController) {
        super();
        this.canvasController = canvasController;
    }

    protected getProp(prop: GlobalSettingsPropType) {}

    protected setProp(val: any, prop: GlobalSettingsPropType) {
        switch (prop) {
            case GlobalSettingsPropType.IMPORT_FILE:
                this.canvasController.writer.import(val.data);
        }
    }
}