import { Segment } from '../shapes/Segment';
import { Point } from '../shapes/Point';
import { GeometryService } from '../GeometryService';


export class Distance {
    private geometryService: GeometryService;

    constructor(geometryService: GeometryService = new GeometryService()) {
        this.geometryService = geometryService;
    }

    pointToSegment(point: Point, segment: Segment): number {
        const [v, w] = segment.getPoints();
        const l2 = dist2(v, w);

        if (l2 === 0) {
            return dist2(point, v);
        }

        var t = ((point.x - v.x) * (w.x - v.x) + (point.y - v.y) * (w.y - v.y)) / l2;
        t = Math.max(0, Math.min(1, t));

        return Math.sqrt(dist2(point, new Point(v.x + t * (w.x - v.x), v.y + t * (w.y - v.y))));
    }


    /**
     * Measures the distance of two segments.
     * The distance is measured by creating a vertical line from the center of segment1, and it returns
     * undefined if it does not intersect segment2.
     */
    twoSegments(segment1: Segment, segment2: Segment): number {
        const wallLine = segment1.getLine();
        const furniturePerpLine = segment2.getPerpendicularBisector();

        if (!this.geometryService.measuerments.linesParallel(wallLine, furniturePerpLine)) {
            const line = this.geometryService.factory.lineFromPointSlopeForm(segment2.getBoundingCenter(), furniturePerpLine.slope);
            const intersection = wallLine.intersection(line);

            if (segment1.isPointOnSegment(intersection)) {
                return intersection.distanceTo(segment2.getBoundingCenter());
            }
        }

        return undefined;
    }
}

function dist2 (v: Point, w: Point): number {
    return Math.pow(v.x - w.x, 2) + Math.pow(v.y - w.y, 2);
}