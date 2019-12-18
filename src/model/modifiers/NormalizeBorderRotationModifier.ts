
import { GameObject } from "../types/GameObject";
import { Modifier } from "./Modifier";
import { SplitWallsIntoTwoParallelChildWallsModifier } from './SplitWallsIntoTwoParallelChildWallsModifier';
import { Segment } from "../../geometry/shapes/Segment";
import { Line } from "../../geometry/shapes/Line";


export class NormalizeBorderRotationModifier implements Modifier {
    static modName = 'normalizeBorderRotation';
    dependencies = [SplitWallsIntoTwoParallelChildWallsModifier.modName];

    getName(): string {
        return NormalizeBorderRotationModifier.modName;
    }

    apply(rootItems: GameObject[]): GameObject[] {
        rootItems[0].children
            .filter(child => child.isBorder === true)
            .forEach(border => this.normalizeBorder(border));

        return rootItems;
    }

    private normalizeBorder(border: GameObject) {
        if (!(border.dimensions instanceof Segment)) {
            throw new Error('Normalizing is supported only for segments.');
        }

        border.rotation = border.dimensions.getLine().getAngleToXAxis().getAngle();
        border.normalizedDimensions = this.makeSegmentHorizontal(border.dimensions);
    }

    private makeSegmentHorizontal(segment: Segment): Segment {
        const line = Line.fromPointSlopeForm(segment.getBoundingCenter(), 0);
        const [point1, point2] = line.getSegmentWithCenterPointAndDistance(segment.getBoundingCenter(), segment.getLength() / 2);
        return new Segment(point1, point2);
    }
}