import { CanvasView } from '../CanvasView';
import { AbstractSettings } from './AbstractSettings';
import { UpdateTask } from '../../../services/UpdateServices';
import { MeshConcept } from '../../../models/concepts/MeshConcept';
import { Stores } from '../../../stores/Stores';
import { ServiceLocator } from '../../../services/ServiceLocator';
import { Registry } from '../../../Registry';

export enum GlobalSettingsPropType {
    IMPORT_FILE = 'import file'
}

export class GlobalSettings extends AbstractSettings<GlobalSettingsPropType> {
    static type = 'global-settings';
    getName() { return GlobalSettings.type; }

    meshConcept: MeshConcept;

    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }


    protected getProp(prop: GlobalSettingsPropType) {}

    protected setProp(val: any, prop: GlobalSettingsPropType) {
        switch (prop) {
            case GlobalSettingsPropType.IMPORT_FILE:
                this.registry.stores.canvasStore.clear();
                this.registry.stores.hoverStore.clear();
                this.registry.stores.selectionStore.clear();
                this.registry.services.import.import(val.data)
        }
        this.registry.services.update.runImmediately(UpdateTask.RepaintCanvas, UpdateTask.UpdateRenderer);
    }
}