import { AbstractSidepanelPlugin } from '../../../core/plugin/AbstractSidepanelPlugin';
import { UI_Region } from '../../../core/plugin/UI_Plugin';
import { UI_Layout } from '../../../core/ui_components/elements/UI_Layout';
import { LayoutSettingsProps } from './LayoutSettingsProps';

export const LayoutSettingsPluginId = 'layout-settings-plugin';

export class LayoutSettingsPlugin extends AbstractSidepanelPlugin {
    id = LayoutSettingsPluginId;
    displayName = 'Layout Settings';
    region = UI_Region.Sidepanel;

    renderInto(layout: UI_Layout): UI_Layout {
        let row = layout.row({ key: LayoutSettingsProps.Layout });

        const layoutSelect = row.select({prop: LayoutSettingsProps.Layout});
        layoutSelect.layout = 'horizontal';
        layoutSelect.label = 'Layouts';
        layoutSelect.placeholder = 'Select Layout';

        return layout;
    }
}