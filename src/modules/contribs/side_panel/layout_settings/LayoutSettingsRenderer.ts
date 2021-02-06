import { IRenderer } from "../../../../core/models/IRenderer";
import { UI_Panel } from "../../../../core/models/UI_Panel";
import { UI_Container } from "../../../../core/ui_components/elements/UI_Container";
import { UI_Layout } from "../../../../core/ui_components/elements/UI_Layout";
import { LayoutSettingsControllers, LayoutSettingsProps } from "./LayoutSettingsControllers";

export class LayoutSettingsRenderer implements IRenderer<UI_Layout> {
    private panel: UI_Panel;
    private controller: LayoutSettingsControllers;

    constructor(panel: UI_Panel, controller: LayoutSettingsControllers) {
        this.panel = panel;
        this.controller = controller;
    }

    renderInto(layout: UI_Layout): void {
        let row = layout.row({ key: LayoutSettingsProps.Layout, controller: this.panel.controller });

        const layoutSelect = row.select({key: LayoutSettingsProps.Layout});
        layoutSelect.paramController = this.controller.layout; 
        layoutSelect.layout = 'horizontal';
        layoutSelect.label = 'Layouts';
        layoutSelect.placeholder = 'Select Layout';
    }
}