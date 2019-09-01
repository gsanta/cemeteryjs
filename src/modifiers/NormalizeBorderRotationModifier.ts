
import { Line, Segment } from "@nightshifts.inc/geometry";
import { WorldItem } from "../WorldItemInfo";
import { Modifier } from "./Modifier";
import { AddOuterBorderLayerModifier } from './AddOuterBorderLayerModifier';


export class NormalizeBorderRotationModifier implements Modifier {
    static modName = 'normalizeBorderRotation';
    dependencies = [AddOuterBorderLayerModifier.modName];

    getName(): string {
        return NormalizeBorderRotationModifier.name;
    }

    apply(rootItems: WorldItem[]): WorldItem[] {
        rootItems[0].children
            .filter(child => child.isBorder === true)
            .forEach(border => this.normalizeBorder(border));

        return rootItems;
    }

    private normalizeBorder(border: WorldItem) {
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