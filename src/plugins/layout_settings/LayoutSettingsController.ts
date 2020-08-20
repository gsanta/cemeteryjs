import { Registry } from '../../core/Registry';
import { AbstractController } from '../../core/plugins/controllers/AbstractController';
import { UI_Plugin } from '../../core/plugins/UI_Plugin';

export enum LayoutSettingsProps {
    SelectedLayout = 'SelectedLayout'
}

export const LayoutSettingsControllerId = 'layout-settings-controller';
export class LayoutSettingsController extends AbstractController<LayoutSettingsProps> {
    id = LayoutSettingsControllerId;
    constructor(plugin: UI_Plugin, registry: Registry) {
        super(plugin, registry);

        this.createPropHandler<string>(LayoutSettingsProps.SelectedLayout)
            .onChange((val) => {
                this.registry.services.uiPerspective.activatePerspective(val);
                this.registry.services.render.reRenderAll();
            })
            .onGet(() => {
                return this.registry.services.uiPerspective.activePerspective ? this.registry.services.uiPerspective.activePerspective.name : '';
            })
    }
}