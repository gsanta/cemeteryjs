import { CanvasAxis } from "../../../../../core/models/misc/CanvasAxis"
import { Registry } from "../../../../../core/Registry"
import { LineSegment } from "../../../../../utils/geometry/shapes/LineSegment"
import { Point } from "../../../../../utils/geometry/shapes/Point"


export function getAxisColor(axis: CanvasAxis, registry: Registry) {
    switch(axis) {
        case CanvasAxis.X:
            return registry.preferences.colors.red;
        case CanvasAxis.Y:
            return registry.preferences.colors.green;
        case CanvasAxis.Z:
            return registry.preferences.colors.blue;
    }
}

export const axisLength = 50;
const diagonalAxisLength = axisLength / Math.sqrt(2);

export const axisLineBounds: { [axis: string]: LineSegment } = {
    [CanvasAxis.X]: new LineSegment(new Point(0, 0), new Point(axisLength, 0)),
    [CanvasAxis.Y]: new LineSegment(new Point(0, 0), new Point(diagonalAxisLength, -diagonalAxisLength)),
    [CanvasAxis.Z]: new LineSegment(new Point(0, 0), new Point(0, -axisLength))
}