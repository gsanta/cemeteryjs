import { IRenderer } from "../../../core/plugin/IRenderer";
import { UI_Panel } from "../../../core/plugin/UI_Panel";
import { UI_Layout } from "../../../core/ui_components/elements/UI_Layout";
import { LayoutSettingsControllers } from "./LayoutSettingsControllers";

export class LayoutSettingsRenderer implements IRenderer<UI_Layout> {
    private panel: UI_Panel;
    private controller: LayoutSettingsControllers;

    constructor(panel: UI_Panel, controller: LayoutSettingsControllers) {
        this.panel = panel;
        this.controller = controller;
    }

    renderInto(layout: UI_Layout): void {
        let row = layout.row({ key: 'layout-row', controller: this.panel.controller });

        const layoutSelect = row.select({ key: 'layout' });
        layoutSelect.paramController = this.controller.layout; 
        layoutSelect.layout = 'horizontal';
        layoutSelect.label = 'Layouts';
        layoutSelect.placeholder = 'Select Layout';
    }
}