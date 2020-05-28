import { AbstractSettings } from './AbstractSettings';
import { MeshView } from '../../../core/models/views/MeshView';
import { Registry } from '../../../core/Registry';
import { UpdateTask } from '../../../core/services/UpdateServices';

export enum LayoutPropType {
    Layout = 'Layout',
}

export class LayoutSettings extends AbstractSettings<LayoutPropType> {
    static type = 'layout-settings';
    getName() { return LayoutSettings.type; }
    meshConcept: MeshView;

    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    protected getProp(prop: LayoutPropType) {
        switch (prop) {
            case LayoutPropType.Layout:
                return this.registry.services.layout.predefinedLayouts;
        }
    }

    protected setProp(val: any, prop: LayoutPropType) {
        switch (prop) {
            case LayoutPropType.Layout:
                const layout = this.registry.services.layout.predefinedLayouts.find(layout => layout.title === val);
                this.registry.services.layout.selectPredefinedLayout(layout.title);
                this.registry.services.update.runImmediately(UpdateTask.Full);
                break;
        }
    }
}