import { EventDispatcher } from '../../../common/EventDispatcher';
import { CanvasWindow } from '../CanvasWindow';
import { AbstractForm } from './AbstractForm';
import { UpdateTask } from '../../../common/services/UpdateServices';
import { MeshView } from '../models/views/MeshView';
import { Stores } from '../../../Stores';

export enum GlobalSettingsPropType {
    IMPORT_FILE = 'import file'
}

export class GlobalSettingsForm extends AbstractForm<GlobalSettingsPropType> {
    gameObject: MeshView;

    private controller: CanvasWindow;
    private getStores: () => Stores;

    constructor(controller: CanvasWindow, getStores: () => Stores) {
        super();
        this.controller = controller;
        this.getStores = getStores;
    }

    protected getProp(prop: GlobalSettingsPropType) {}

    protected setProp(val: any, prop: GlobalSettingsPropType) {
        switch (prop) {
            case GlobalSettingsPropType.IMPORT_FILE:
                this.getStores().viewStore.clear();
                this.controller.importer.import(val.data);
                this.getStores().viewStore.getGameObjects().filter(item => item.modelPath).forEach(item => this.controller.model3dController.set3dModelForCanvasItem(item));
        }
        this.controller.updateService.runImmediately(UpdateTask.RepaintCanvas, UpdateTask.UpdateRenderer);
    }
}