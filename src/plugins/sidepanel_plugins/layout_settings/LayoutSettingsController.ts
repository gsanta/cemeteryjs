import { Registry } from '../../../core/Registry';
import { AbstractController, PropControl } from '../../../core/plugin/controller/AbstractController';
import { UI_Plugin } from '../../../core/plugin/UI_Plugin';

export enum LayoutSettingsProps {
    Layout = 'SelectedLayout'
}

export const LayoutSettingsControllerId = 'layout-settings-controller';
export class LayoutSettingsController extends AbstractController<LayoutSettingsProps> {
    id = LayoutSettingsControllerId;
    constructor(plugin: UI_Plugin, registry: Registry) {
        super(plugin, registry);
        
        this.registerPropControl(LayoutSettingsProps.Layout, LayoutControl);
    }
}

const LayoutControl: PropControl<string> = {
    defaultVal(context) {
        return context.registry.services.uiPerspective.activePerspective ? context.registry.services.uiPerspective.activePerspective.name : '';
    },

    change(val, context) {
        context.registry.services.uiPerspective.activatePerspective(val);
        context.registry.services.render.reRenderAll();
    },

    values(context) {
        return context.registry.services.uiPerspective.perspectives.map(perspective => perspective.name);

    }
}