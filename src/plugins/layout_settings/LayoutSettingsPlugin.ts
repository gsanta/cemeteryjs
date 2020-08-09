import { UI_Plugin, UI_Region } from '../../core/UI_Plugin';
import { Registry } from '../../core/Registry';
import { UI_Layout } from '../../core/gui_builder/elements/UI_Layout';
import { LayoutSettingsController, LayoutSettingsProps, LayoutSettingsControllerId } from './LayoutSettingsController';
import { AbstractSidepanelPlugin } from '../../core/AbstractSidepanelPlugin';

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
        let row = layout.row({ key: LayoutSettingsProps.SelectedLayout });

        const layoutSelect = row.select(LayoutSettingsProps.SelectedLayout, LayoutSettingsProps.AllLayouts);
        layoutSelect.label = 'Layouts';
        layoutSelect.placeholder = 'Select Layout';

        return layout;
    }
}