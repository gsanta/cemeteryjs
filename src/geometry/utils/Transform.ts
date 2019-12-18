import { Matrix } from './Matrix';
import { Point } from '../shapes/Point';
import { Shape } from '../shapes/Shape';
import { Polygon } from '../shapes/Polygon';
import { Segment } from '../shapes/Segment';

export class Transform {

    rotateSegment(segment: Segment, degree: number): Segment {
        const points = this.rotate(segment, degree);
        return new Segment(points[0], points[1]);
    }

    rotatePolygon(polygon: Polygon, degree: number): Polygon {
        return new Polygon(this.rotate(polygon, degree));
    }

    private rotate(shape: Shape, degree: number): Point[] {
        const xVector = shape.getPoints().map(p => p.x);
        const yVector = shape.getPoints().map(p => p.y);

        const P = [xVector, yVector];

        const center = shape.getBoundingCenter();

        const xVectorCent: number[] = [];
        const yVectorCent: number[] = [];

        for (let i = 0; i < xVector.length; i++) {
            xVectorCent.push(center.x);
            yVectorCent.push(center.y);
        }

        const C = [xVectorCent, yVectorCent];

        const R = [
            [ Math.cos(degree), - Math.sin(degree) ],
            [ Math.sin(degree), Math.cos(degree) ]
        ]

        const matrix = new Matrix();

        const Pnew = matrix.add(matrix.multiply(R, matrix.subtract(P, C)), C);

        const points: Point[] = [];

        for (let i = 0; i < Pnew[0].length; i++) {
            points.push(new Point(Pnew[0][i], Pnew[1][i]));
        }

        return points;
    }
}