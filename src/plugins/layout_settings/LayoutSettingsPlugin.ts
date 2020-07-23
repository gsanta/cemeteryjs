import { UI_Plugin, UI_Region } from '../../core/UI_Plugin';
import { Registry } from '../../core/Registry';
import { UI_Layout } from '../../core/gui_builder/elements/UI_Layout';
import { LayoutSettingsController, LayoutSettingsProps } from './LayoutSettingsController';

export const LayoutSettingsPluginId = 'layout-settings-plugin';

export class LayoutSettingsPlugin extends UI_Plugin {
    id = LayoutSettingsPluginId;
    displayName = 'Layout Settings';
    region = UI_Region.SidepanelWidget;

    constructor(registry: Registry) {
        super(registry);

        this.controller = new LayoutSettingsController(this, registry)
    }

    renderInto(layout: UI_Layout): UI_Layout {
        let row = layout.row();

        const layoutSelect = row.select(LayoutSettingsProps.SelectedLayout, LayoutSettingsProps.AllLayouts);
        layoutSelect.label = 'Layouts';
        layoutSelect.placeholder = 'Select Layout';

        return layout;
    }
}