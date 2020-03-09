import { CanvasView } from '../CanvasView';
import { AbstractForm } from './AbstractForm';
import { UpdateTask } from '../../../services/UpdateServices';
import { MeshConcept } from '../models/concepts/MeshConcept';
import { Stores } from '../../../stores/Stores';
import { ServiceLocator } from '../../../services/ServiceLocator';

export enum GlobalSettingsPropType {
    IMPORT_FILE = 'import file'
}

export class GlobalSettingsForm extends AbstractForm<GlobalSettingsPropType> {
    gameObject: MeshConcept;

    private controller: CanvasView;
    private getStores: () => Stores;
    private getServices: () => ServiceLocator;

    constructor(controller: CanvasView, getServices: () => ServiceLocator, getStores: () => Stores) {
        super();
        this.controller = controller;
        this.getStores = getStores;
        this.getServices = getServices;
    }

    protected getProp(prop: GlobalSettingsPropType) {}

    protected setProp(val: any, prop: GlobalSettingsPropType) {
        switch (prop) {
            case GlobalSettingsPropType.IMPORT_FILE:
                this.getStores().conceptStore.clear();
                this.getServices().importService().import(val.data)
                this.getStores().conceptStore.getGameObjects().filter(item => item.modelPath).forEach(item => this.controller.model3dController.set3dModelForCanvasItem(item));
        }
        this.getServices().updateService().runImmediately(UpdateTask.RepaintCanvas, UpdateTask.UpdateRenderer);
    }
}