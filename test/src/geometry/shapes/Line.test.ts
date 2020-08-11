import { Line } from "../../../../src/utils/geometry/shapes/Line";
import { toDegree } from "../../../../src/utils/geometry/shapes/Angle";
import { Point } from "../../../../src/utils/geometry/shapes/Point";

describe(`Line`, () => {
    describe(`fromPointSlopeForm`, () => {
        it ('creates a line with the correct \'b\' and \'m\' values from a `Point` and a slope.', () => {
            const point = new Point(4, 3);
            const slope = 0.5;

            const line = Line.fromPointSlopeForm(point, slope);

            expect(line.yIntercept).toEqual(1);
            expect(line.slope).toEqual(0.5);
        });

        it ('can create a vertical line.', () => {
            const point = new Point(4, 3);
            const slope = undefined;

            const line = Line.fromPointSlopeForm(point, slope);

            expect(line.xIntercept).toEqual(4);
            expect(line.yIntercept).toEqual(undefined);
            expect(line.slope).toEqual(undefined);
        });

        it ('can create a horizontal line.', () => {
            const point = new Point(4, 3);
            const slope = 0;

            const line = Line.fromPointSlopeForm(point, slope);

            expect(line.yIntercept).toEqual(3);
            expect(line.slope).toEqual(0);
        });
    });


    describe(`fromTwoPoints`, () => {
        it ('creates a line from two points.', () => {
            const point = new Point(4, 3);
            // const
            const slope = 0.5;

            const line = Line.fromTwoPoints(new Point(4, 3), new Point(5, 4));
            // expect(line.)

            expect(line.xIntercept).toEqual(1);
            expect(line.yIntercept).toEqual(-1);
            expect(line.slope).toEqual(1);
        });
    });

    describe(`getX`, () => {
        it ('calculates the \'x\' value on the line for the given \'y\'.', () => {
            const point = new Point(4, 4);
            const slope = 0.5;

            const line = Line.fromPointSlopeForm(point, slope);

            expect(line.getX(3)).toEqual(2);
        });
    });

    describe(`getY`, () => {
        it ('calculates the \'y\' value on the line for the given \'x\'.', () => {
            const point = new Point(4, 4);
            const slope = 0.5;

            const line = Line.fromPointSlopeForm(point, slope);

            expect(line.getX(2)).toEqual(0);
        });
    });

    describe(`intersection`, () => {
        it ('calculates the intersection of two `Line`s', () => {

            const line1 = Line.fromPointSlopeForm(new Point(0, 2), 2);
            const line2 = Line.fromPointSlopeForm(new Point(0, -2), 3);

            expect(line1.intersection(line2)).toEqual(new Point(4, 10));
        });

        it ('returns undefined if the slopes are the same', () => {

            const line1 = Line.fromPointSlopeForm(new Point(0, 2), 2);
            const line2 = Line.fromPointSlopeForm(new Point(0, -2), 2);

            expect(line1.intersection(line2)).toEqual(undefined);
        });

        it ('works if one of the `Line`s is vertical', () => {
            const line1 = Line.fromPointSlopeForm(new Point(0, 2), undefined);
            const line2 = Line.fromPointSlopeForm(new Point(0, -2), 2);

            expect(line1.intersection(line2)).toEqual(new Point(0, -2));
            expect(line2.intersection(line1)).toEqual(new Point(0, -2));
        });
    });

    describe(`getSegmentWithCenterPointAndDistance`, () => {
        it ('returns the two endpoints of a segment given the center `Point` and the distance from the center.', () => {
            const center1 = new Point(4, 3);
            const line45deg = Line.fromPointSlopeForm(center1, 1);

            expect(line45deg.getSegmentWithCenterPointAndDistance(center1, Math.SQRT2)).toEqual([new Point(5, 4), new Point(3, 2)]);

            const center2 = new Point(4, 3);
            const lineVertical = Line.createVerticalLine(4);

            expect(lineVertical.getSegmentWithCenterPointAndDistance(center2, 1)).toEqual([new Point(4, 2), new Point(4, 4)]);

            const center3 = new Point(2, 4);
            const lineHorizontal = Line.createHorizontalLine(4);

            expect(lineHorizontal.getSegmentWithCenterPointAndDistance(center3, 2)).toEqual([new Point(0, 4), new Point(4, 4)]);
        });
    });

    describe(`getAngleToXAxis`, () => {
        it ('returns with the line\'s angle to the x axis', () => {
            const line45deg = Line.fromPointSlopeForm(new Point(0, 0), 1);

            expect(toDegree(line45deg.getAngleToXAxis().getAngle())).toEqual(45);

            const lineHorizontal = Line.createHorizontalLine(1);

            expect(toDegree(lineHorizontal.getAngleToXAxis().getAngle())).toEqual(0);

            const lineVertical = Line.createVerticalLine(-2);

            expect(toDegree(lineVertical.getAngleToXAxis().getAngle())).toEqual(90);

            const lineneg45Deg = Line.fromPointSlopeForm(new Point(0, 0), -1);

            expect(toDegree(lineneg45Deg.getAngleToXAxis().getAngle())).toEqual(315);
        });
    });
});
