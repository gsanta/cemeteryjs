import { AbstractSettings } from './AbstractSettings';
import { MeshConcept } from '../../../core/models/concepts/MeshConcept';
import { Registry } from '../../../core/Registry';
import { UpdateTask } from '../../../core/services/UpdateServices';

export enum LayoutPropType {
    Layout = 'Layout',
}

export class LayoutSettings extends AbstractSettings<LayoutPropType> {
    static type = 'layout-settings';
    getName() { return LayoutSettings.type; }
    meshConcept: MeshConcept;

    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    protected getProp(prop: LayoutPropType) {
        switch (prop) {
            case LayoutPropType.Layout:
                return this.registry.services.layout.layouts;
        }
    }

    protected setProp(val: any, prop: LayoutPropType) {
        switch (prop) {
            case LayoutPropType.Layout:
                const layout = this.registry.services.layout.layouts.find(layout => layout.name === val);
                this.registry.services.layout.setActiveLayout(layout);
                this.registry.services.update.runImmediately(UpdateTask.Full);
                break;
        }
    }
}