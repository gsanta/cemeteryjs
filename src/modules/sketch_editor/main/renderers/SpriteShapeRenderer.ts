import { AbstractShape, ShapeRenderer, ShapeTag } from "../../../../core/models/shapes/AbstractShape";
import { AbstractCanvasPanel } from "../../../../core/models/modules/AbstractCanvasPanel";
import { UI_SvgCanvas } from "../../../../core/ui_components/elements/UI_SvgCanvas";
import { colors } from "../../../../core/ui_components/react/styles";
import { SpriteShape, SpriteShapeType } from "../models/shapes/SpriteShape";

export class SpriteShapeRenderer implements ShapeRenderer {
    id: string = SpriteShapeType;

    renderInto(canvas: UI_SvgCanvas, view: SpriteShape, panel: AbstractCanvasPanel<AbstractShape>): void {
        const group = canvas.group(view.id);
        group.data = view;
        group.transform = `translate(${view.getBounds().topLeft.x} ${view.getBounds().topLeft.y})`;
        const rect = group.rect();
        rect.width = view.getBounds().getWidth();
        rect.height = view.getBounds().getHeight();
        rect.fillColor = view.color;

        rect.strokeColor = view.tags.has(ShapeTag.Selected) ? colors.views.highlight : 'black';

        view.containedShapes.forEach(child => child.renderer.renderInto(canvas, child, panel));
    }
}