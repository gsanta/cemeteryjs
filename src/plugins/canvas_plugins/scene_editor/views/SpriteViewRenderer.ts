import { ViewRenderer, ViewTag } from "../../../../core/models/views/View";
import { AbstractCanvasPanel } from "../../../../core/plugin/AbstractCanvasPanel";
import { UI_SvgCanvas } from "../../../../core/ui_components/elements/UI_SvgCanvas";
import { colors } from "../../../../core/ui_components/react/styles";
import { SpriteView, SpriteViewType } from "./SpriteView";

export class SpriteViewRenderer implements ViewRenderer {
    id: string = SpriteViewType;

    renderInto(canvas: UI_SvgCanvas, view: SpriteView, panel: AbstractCanvasPanel): void {
        const group = canvas.group(view.id);
        group.data = view;
        group.transform = `translate(${view.getBounds().topLeft.x} ${view.getBounds().topLeft.y})`;
        const rect = group.rect();
        rect.width = view.getBounds().getWidth();
        rect.height = view.getBounds().getHeight();
        rect.fillColor = view.color;

        rect.strokeColor = view.tags.has(ViewTag.Selected) ? colors.views.highlight : 'black';

        view.containedViews.forEach(child => child.renderer.renderInto(canvas, child, panel));
    }
}