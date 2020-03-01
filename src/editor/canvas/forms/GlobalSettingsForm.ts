import { EventDispatcher } from '../../common/EventDispatcher';
import { Events } from '../../common/Events';
import { CanvasController } from '../CanvasController';
import { MeshView } from '../models/views/MeshView';
import { AbstractForm } from './AbstractForm';
import { UpdateTask } from '../../common/services/UpdateServices';

export enum GlobalSettingsPropType {
    IMPORT_FILE = 'import file'
}

export class GlobalSettingsForm extends AbstractForm<GlobalSettingsPropType> {
    gameObject: MeshView;

    private controller: CanvasController;
    private eventDispatcher: EventDispatcher;

    constructor(controller: CanvasController, eventDispatcher: EventDispatcher) {
        super();
        this.controller = controller;
        this.eventDispatcher = eventDispatcher;
    }

    protected getProp(prop: GlobalSettingsPropType) {}

    protected setProp(val: any, prop: GlobalSettingsPropType) {
        switch (prop) {
            case GlobalSettingsPropType.IMPORT_FILE:
                this.controller.viewStore.clear();
                this.controller.importer.import(val.data);
                this.controller.viewStore.getGameObjects().filter(item => item.modelPath).forEach(item => this.controller.model3dController.set3dModelForCanvasItem(item));
        }
        this.controller.updateService.runImmediately(UpdateTask.RepaintCanvas, UpdateTask.UpdateRenderer);
    }
}