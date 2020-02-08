import { Point } from "../shapes/Point";
import { Angle } from '../shapes/Angle';
import { Line } from '../shapes/Line';

export function toRadian(degree: number) {
    return degree * Math.PI / 180;
 }

export function toDegree(radian: number) {
    return radian * 180 / Math.PI;
}

export class Measurements {
    // TODO: rename to smth like "closeTo" so that the exact distance is not mentioned in the name
    public static isDistanceSmallerThan(point1: Point, point2: Point, unit = 0.5) {
        return point1.distanceTo(point2) <= unit;
    }


    anglesEqual(angle1: Angle, angle2: Angle) {
        return Math.abs(angle1.getAngle() - angle2.getAngle()) < 0.1;
    }

    angleToBe(angle1: Angle, rad: number) {
        return Math.abs(angle1.getAngle() - rad) < 0.1;
    }

    radToBe(actualRad: number, expectedRad: number) {
        return Math.abs(actualRad - expectedRad) < 0.1;
    }

    linesParallel(line1: Line, line2: Line) {
        return line1.slope === line2.slope;
    }

    coordinatesEqual(coord1: number, coord2: number) {
        return Math.abs(coord1 - coord2) < 0.1;
    }

    pointsAreVeryClose(point1: Point, point2: Point) {
        return Math.abs(point1.x - point2.x) < 0.1 && Math.abs(point1.y - point2.y) < 0.1;
    }
}