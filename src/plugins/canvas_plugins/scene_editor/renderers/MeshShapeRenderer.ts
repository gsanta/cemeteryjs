import { ShapeRenderer, ShapeTag } from "../../../../core/models/views/AbstractShape";
import { UI_SvgCanvas } from "../../../../core/ui_components/elements/UI_SvgCanvas";
import { colors } from "../../../../core/ui_components/react/styles";
import { toDegree } from "../../../../utils/geometry/Measurements";
import { MeshShape } from "../models/shapes/MeshShape";

export class MeshShapeRenderer implements ShapeRenderer {
    renderInto(canvas: UI_SvgCanvas, meshView: MeshShape) {
        const group = canvas.group(meshView.id);
        group.data = meshView;

        const translation = `${meshView.getBounds().topLeft.x} ${meshView.getBounds().topLeft.y}`;
        const rotation = `${toDegree(meshView.getRotation())} ${meshView.getBounds().getWidth() / 2} ${meshView.getBounds().getHeight() / 2}`;
        group.transform = `translate(${translation}) rotate(${rotation})`;
        const rect = group.rect();
        rect.width = meshView.getBounds().getWidth();
        rect.height = meshView.getBounds().getHeight();

        rect.css = {
            strokeWidth: meshView.isSelected() ? '2' : '1',
            fill: meshView.color
        }    

        rect.strokeColor = meshView.tags.has(ShapeTag.Selected) ? colors.views.highlight : 'black';

        if (meshView.thumbnailData) {
            const image = group.image();
            image.href = meshView.thumbnailData;
            image.width = meshView.getBounds().getWidth();
            image.height = meshView.getBounds().getHeight();
            image.preservAspectRatio = "xMidYMid slice";
        }
    }
}