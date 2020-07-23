import { Registry } from '../../core/Registry';
import { AbstractController } from '../scene_editor/settings/AbstractController';
import { RenderTask } from '../../core/services/RenderServices';
import { UI_Plugin } from '../../core/UI_Plugin';

export enum LayoutSettingsProps {
    AllLayouts = 'AllLayouts',
    SelectedLayout = 'SelectedLayout'
}

export class LayoutSettingsController extends AbstractController<LayoutSettingsProps> {
    constructor(plugin: UI_Plugin, registry: Registry) {
        super(plugin, registry);

        this.createPropHandler(LayoutSettingsProps.AllLayouts)
            .onGet(() => {
                return this.registry.plugins.predefinedLayouts.map(layout => layout.title);
            });

        this.createPropHandler(LayoutSettingsProps.SelectedLayout)
            .onChange((val) => {
                const layout = this.registry.plugins.predefinedLayouts.find(layout => layout.title === val);
                this.registry.plugins.selectPredefinedLayout(layout.title);
                this.registry.services.render.runImmediately(RenderTask.RenderFull);
            })
            .onGet(() => {
                return this.registry.plugins.getCurrentPredefinedLayout().title;
            })
    }
}