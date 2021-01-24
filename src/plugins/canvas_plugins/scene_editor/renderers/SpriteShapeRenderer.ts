import { ShapeRenderer, ShapeTag } from "../../../../core/models/views/AbstractShape";
import { AbstractCanvasPanel } from "../../../../core/plugin/AbstractCanvasPanel";
import { UI_SvgCanvas } from "../../../../core/ui_components/elements/UI_SvgCanvas";
import { colors } from "../../../../core/ui_components/react/styles";
import { SpriteView, SpriteShapeType } from "../models/shapes/SpriteShape";

export class SpriteShapeRenderer implements ShapeRenderer {
    id: string = SpriteShapeType;

    renderInto(canvas: UI_SvgCanvas, view: SpriteView, panel: AbstractCanvasPanel): void {
        const group = canvas.group(view.id);
        group.data = view;
        group.transform = `translate(${view.getBounds().topLeft.x} ${view.getBounds().topLeft.y})`;
        const rect = group.rect();
        rect.width = view.getBounds().getWidth();
        rect.height = view.getBounds().getHeight();
        rect.fillColor = view.color;

        rect.strokeColor = view.tags.has(ShapeTag.Selected) ? colors.views.highlight : 'black';

        view.containedViews.forEach(child => child.renderer.renderInto(canvas, child, panel));
    }
}