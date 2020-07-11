import { UI_Plugin, UI_Region } from '../../core/UI_Plugin';
import { Registry } from '../../core/Registry';
import { UI_Layout } from '../../core/gui_builder/elements/UI_Layout';

export class AssetManagerSidepanelPlugin extends UI_Plugin {
    id = 'asset_manager_dialog_plugin';
    region = UI_Region.SidepanelWidget;

    constructor(registry: Registry) {
        super(registry);
    }

    renderInto(layout: UI_Layout): void {
        const row = layout.row();
        row.button('abcd');
    }
}