import { AbstractSettings } from './AbstractSettings';
import { MeshView } from '../../../core/models/views/MeshView';
import { Registry } from '../../../core/Registry';
import { RenderTask } from '../../../core/services/RenderServices';

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
                return this.registry.services.plugin.predefinedLayouts;
        }
    }

    protected setProp(val: any, prop: LayoutPropType) {
        switch (prop) {
            case LayoutPropType.Layout:
                const layout = this.registry.services.plugin.predefinedLayouts.find(layout => layout.title === val);
                this.registry.services.plugin.selectPredefinedLayout(layout.title);
                this.registry.services.update.runImmediately(RenderTask.RenderFull);
                break;
        }
    }
}