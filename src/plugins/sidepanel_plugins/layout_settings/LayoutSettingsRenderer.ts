import { IRenderer } from "../../../core/plugin/IRenderer";
import { UI_Container } from "../../../core/ui_components/elements/UI_Container";
import { UI_Layout } from "../../../core/ui_components/elements/UI_Layout";
import { LayoutSettingsProps } from "./LayoutSettingsProps";

export class LayoutSettingsRenderer implements IRenderer<UI_Layout> {
    renderInto(layout: UI_Layout): void {
        let row = layout.row({ key: LayoutSettingsProps.Layout });

        const layoutSelect = row.select({key: LayoutSettingsProps.Layout});
        layoutSelect.layout = 'horizontal';
        layoutSelect.label = 'Layouts';
        layoutSelect.placeholder = 'Select Layout';
    }
}