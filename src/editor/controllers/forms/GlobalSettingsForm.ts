import { MeshView } from '../../../common/views/MeshView';
import { CanvasController } from '../canvases/svg/CanvasController';
import { AbstractForm } from './AbstractForm';
import { EditorFacade } from '../EditorFacade';

export enum GlobalSettingsPropType {
    IMPORT_FILE = 'import file'
}

export class GlobalSettingsForm extends AbstractForm<GlobalSettingsPropType> {
    gameObject: MeshView;

    private services: EditorFacade;

    constructor(services: EditorFacade) {
        super();
        this.services = services;
    }

    protected getProp(prop: GlobalSettingsPropType) {}

    protected setProp(val: any, prop: GlobalSettingsPropType) {
        switch (prop) {
            case GlobalSettingsPropType.IMPORT_FILE:
                this.services.viewStore.clear();
                this.services.svgCanvasController.writer.import(val.data);
                this.services.viewStore.getGameObjects().filter(item => item.modelPath).forEach(item => this.services.svgCanvasController.model3dController.set3dModelForCanvasItem(item));
        }
    }
}