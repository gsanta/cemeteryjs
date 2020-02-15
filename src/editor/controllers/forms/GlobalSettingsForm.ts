import { MeshView } from '../../../common/views/MeshView';
import { AbstractForm } from './AbstractForm';
import { Controllers } from '../Controllers';
import { EventDispatcher } from '../events/EventDispatcher';
import { Events } from '../events/Events';

export enum GlobalSettingsPropType {
    IMPORT_FILE = 'import file'
}

export class GlobalSettingsForm extends AbstractForm<GlobalSettingsPropType> {
    gameObject: MeshView;

    private services: Controllers;
    private eventDispatcher: EventDispatcher;

    constructor(services: Controllers, eventDispatcher: EventDispatcher) {
        super();
        this.services = services;
        this.eventDispatcher = eventDispatcher;
    }

    protected getProp(prop: GlobalSettingsPropType) {}

    protected setProp(val: any, prop: GlobalSettingsPropType) {
        switch (prop) {
            case GlobalSettingsPropType.IMPORT_FILE:
                this.services.svgCanvasController.viewStore.clear();
                this.services.svgCanvasController.writer.import(val.data);
                this.services.svgCanvasController.viewStore.getGameObjects().filter(item => item.modelPath).forEach(item => this.services.svgCanvasController.model3dController.set3dModelForCanvasItem(item));
        }
        this.services.svgCanvasController.renderWindow();
        this.eventDispatcher.dispatchEvent(Events.CANVAS_ITEM_CHANGED);
    }
}