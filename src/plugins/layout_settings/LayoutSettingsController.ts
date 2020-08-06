import { Registry } from '../../core/Registry';
import { AbstractController } from '../scene_editor/settings/AbstractController';
import { RenderTask } from '../../core/services/RenderServices';
import { UI_Plugin } from '../../core/UI_Plugin';

export enum LayoutSettingsProps {
    AllLayouts = 'AllLayouts',
    SelectedLayout = 'SelectedLayout'
}

export const LayoutSettingsControllerId = 'layout-settings-controller';
export class LayoutSettingsController extends AbstractController<LayoutSettingsProps> {
    id = LayoutSettingsControllerId;
    constructor(plugin: UI_Plugin, registry: Registry) {
        super(plugin, registry);

        this.createPropHandler(LayoutSettingsProps.AllLayouts)
            .onGet(() => {
                return this.registry.services.uiPerspective.perspectives.map(perspective => perspective.name);
            });

        this.createPropHandler<string>(LayoutSettingsProps.SelectedLayout)
            .onChange((val) => {
                this.registry.services.uiPerspective.activatePerspective(val);
                this.registry.services.render.runImmediately(RenderTask.RenderFull);
            })
            .onGet(() => {
                return this.registry.services.uiPerspective.activePerspective ? this.registry.services.uiPerspective.activePerspective.name : '';
            })
    }
}