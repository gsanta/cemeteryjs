import { Segment } from './shapes/Segment';
import { Point } from './shapes/Point';
import { Line } from './shapes/Line';
import { Measurements } from './Measurements';


export class Distance {
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
}

function dist2 (v: Point, w: Point): number {
    return Math.pow(v.x - w.x, 2) + Math.pow(v.y - w.y, 2);
}