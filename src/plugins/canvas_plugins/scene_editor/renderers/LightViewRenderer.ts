import { ViewRenderer, View, ViewTag } from "../../../../core/models/views/View";
import { AbstractCanvasPanel } from "../../../../core/plugin/AbstractCanvasPanel";
import { UI_SvgCanvas } from "../../../../core/ui_components/elements/UI_SvgCanvas";
import { colors } from "../../../../core/ui_components/react/styles";
import { LightViewType } from "../models/views/LightView";

export class LightViewRenderer implements ViewRenderer {
    id: string = LightViewType;

    renderInto(canvas: UI_SvgCanvas, lightView: View, panel: AbstractCanvasPanel): void {
        const group = canvas.group(lightView.id);
        group.data = lightView;

        const translation = `${lightView.getBounds().topLeft.x} ${lightView.getBounds().topLeft.y}`;
        group.transform = `translate(${translation})`;

        const rect = group.rect();
        rect.width = lightView.getBounds().getWidth();
        rect.height = lightView.getBounds().getHeight();

        rect.css = {
            strokeWidth: lightView.isSelected() ? '2' : '1',
            fill: 'none'
        }    
        rect.strokeColor = lightView.tags.has(ViewTag.Selected) ? colors.views.highlight : 'transparent';

        const image = group.image(lightView.id);
        // TODO cucumber tests fail when requiring static asstes, so it is put here
        image.href = require('../../../../../assets/images/icons/light.svg');
        image.transform = `translate(${lightView.getBounds().topLeft.x} ${lightView.getBounds().topLeft.y})`;
        image.width = lightView.getBounds().getWidth();
        image.height = lightView.getBounds().getHeight();

        lightView.containedViews.forEach(child => child.renderer.renderInto(canvas, child, panel));
    }
}
