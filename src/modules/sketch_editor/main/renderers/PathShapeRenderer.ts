import { ShapeRenderer } from "../../../../core/models/shapes/AbstractShape";
import { UI_SvgCanvas } from "../../../../core/ui_components/elements/UI_SvgCanvas";
import { PathShape } from "../models/shapes/PathShape";

export class PathShapeRenderer implements ShapeRenderer {
    renderInto(canvas: UI_SvgCanvas, pathView: PathShape) {
        const group = canvas.group(pathView.id);
        group.isInteractive = false;

        if (pathView.containedShapes.length > 1) {
            const highlightPath = group.path();
            highlightPath.d = pathView.serializePath();
            highlightPath.data = pathView;

            highlightPath.css = {
                fill: 'none',
                stroke: 'blue',
                strokeOpacity: pathView.isHovered() || pathView.isSelected() ? 0.5 : 0,
                strokeWidth: "4"
            }

            const path = group.path();
            path.d = pathView.serializePath();

            path.css = {
                fill: 'none',
                stroke: 'black',
                strokeWidth: "2",
                pointerEvents: 'none'
            }
        }

        pathView.containedShapes.forEach(editPoint => {
            const circle = group.circle();

            circle.cx = editPoint.point.x;
            circle.cy = editPoint.point.y;
            circle.r = pathView.radius;
            circle.data = editPoint;

            circle.css = {
                fill: pathView.getActiveContainedView() === editPoint ? 'orange' : (pathView.isHovered() || pathView.isSelected()) ? 'blue' : 'black'
            }
        });
    }
}