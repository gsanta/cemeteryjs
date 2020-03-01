import { EventDispatcher } from '../../../common/EventDispatcher';
import { CanvasWindow } from '../CanvasWindow';
import { AbstractForm } from './AbstractForm';
import { UpdateTask } from '../../../common/services/UpdateServices';
import { MeshView } from '../models/views/MeshView';

export enum GlobalSettingsPropType {
    IMPORT_FILE = 'import file'
}

export class GlobalSettingsForm extends AbstractForm<GlobalSettingsPropType> {
    gameObject: MeshView;

    private controller: CanvasWindow;
    private eventDispatcher: EventDispatcher;

    constructor(controller: CanvasWindow, eventDispatcher: EventDispatcher) {
        super();
        this.controller = controller;
        this.eventDispatcher = eventDispatcher;
    }

    protected getProp(prop: GlobalSettingsPropType) {}

    protected setProp(val: any, prop: GlobalSettingsPropType) {
        switch (prop) {
            case GlobalSettingsPropType.IMPORT_FILE:
                this.controller.stores.viewStore.clear();
                this.controller.importer.import(val.data);
                this.controller.stores.viewStore.getGameObjects().filter(item => item.modelPath).forEach(item => this.controller.model3dController.set3dModelForCanvasItem(item));
        }
        this.controller.updateService.runImmediately(UpdateTask.RepaintCanvas, UpdateTask.UpdateRenderer);
    }
}