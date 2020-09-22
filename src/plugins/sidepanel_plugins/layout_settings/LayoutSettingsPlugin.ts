import { AbstractSidepanelPlugin } from '../../../core/plugin/AbstractSidepanelPlugin';
import { UI_Region } from '../../../core/plugin/UI_Plugin';
import { Registry } from '../../../core/Registry';
import { UI_Layout } from '../../../core/ui_components/elements/UI_Layout';
import { LayoutSettingsController, LayoutSettingsControllerId, LayoutSettingsProps } from './LayoutSettingsController';

export const LayoutSettingsPluginId = 'layout-settings-plugin';

export class LayoutSettingsPlugin extends AbstractSidepanelPlugin {
    id = LayoutSettingsPluginId;
    displayName = 'Layout Settings';
    region = UI_Region.Sidepanel;
    isGlobalPlugin = true;

    constructor(registry: Registry) {
        super(registry);

        this.controllers.set(LayoutSettingsControllerId, new LayoutSettingsController(this, registry));
    }

    renderInto(layout: UI_Layout): UI_Layout {
        layout.controllerId = LayoutSettingsControllerId;
        let row = layout.row({ key: LayoutSettingsProps.Layout });

        const layoutSelect = row.select({prop: LayoutSettingsProps.Layout});
        layoutSelect.layout = 'horizontal';
        layoutSelect.label = 'Layouts';
        layoutSelect.placeholder = 'Select Layout';

        return layout;
    }
}