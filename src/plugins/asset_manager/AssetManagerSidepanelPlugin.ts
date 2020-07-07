import { UI_Plugin, UI_Region } from '../../core/UI_Plugin';
import { UI_Layout } from '../../core/gui_builder/UI_Element';
import { AbstractSettings } from '../scene_editor/settings/AbstractSettings';
import { Registry } from '../../core/Registry';

export class AssetManagerSidepanelPlugin extends UI_Plugin {
    id = 'asset_manager_dialog_plugin';
    region = UI_Region.SidepanelWidget;

    constructor(registry: Registry) {
        super(registry);
    }

    render(): UI_Layout {
        const layout = new UI_Layout(this.controller);
        const row = layout.row();
        row.button('abcd');

        return layout;
    }
}