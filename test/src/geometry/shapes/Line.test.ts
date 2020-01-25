import { GeometryService } from "../../../../src/model/geometry/GeometryService";
import { Line } from "../../../../src/model/geometry/shapes/Line";
import { toDegree } from "../../../../src/model/geometry/shapes/Angle";

describe(`Line`, () => {
    const geometryService = new GeometryService();
    describe(`fromPointSlopeForm`, () => {
        it ('creates a line with the correct \'b\' and \'m\' values from a `Point` and a slope.', () => {
            const point = geometryService.factory.point(4, 3);
            const slope = 0.5;

            const line = Line.fromPointSlopeForm(point, slope);

            expect(line.yIntercept).toEqual(1);
            expect(line.slope).toEqual(0.5);
        });

        it ('can create a vertical line.', () => {
            const point = geometryService.factory.point(4, 3);
            const slope = undefined;

            const line = Line.fromPointSlopeForm(point, slope);

            expect(line.xIntercept).toEqual(4);
            expect(line.yIntercept).toEqual(undefined);
            expect(line.slope).toEqual(undefined);
        });

        it ('can create a horizontal line.', () => {
            const point = geometryService.factory.point(4, 3);
            const slope = 0;

            const line = Line.fromPointSlopeForm(point, slope);

            expect(line.yIntercept).toEqual(3);
            expect(line.slope).toEqual(0);
        });
    });


    describe(`fromTwoPoints`, () => {
        it ('creates a line from two points.', () => {
            const point = geometryService.factory.point(4, 3);
            // const
            const slope = 0.5;

            const line = Line.fromTwoPoints(geometryService.factory.point(4, 3), geometryService.factory.point(5, 4));
            // expect(line.)

            expect(line.xIntercept).toEqual(1);
            expect(line.yIntercept).toEqual(-1);
            expect(line.slope).toEqual(1);
        });
    });

    describe(`getX`, () => {
        it ('calculates the \'x\' value on the line for the given \'y\'.', () => {
            const point = geometryService.factory.point(4, 4);
            const slope = 0.5;

            const line = Line.fromPointSlopeForm(point, slope);

            expect(line.getX(3)).toEqual(2);
        });
    });

    describe(`getY`, () => {
        it ('calculates the \'y\' value on the line for the given \'x\'.', () => {
            const point = geometryService.factory.point(4, 4);
            const slope = 0.5;

            const line = Line.fromPointSlopeForm(point, slope);

            expect(line.getX(2)).toEqual(0);
        });
    });

    describe(`intersection`, () => {
        it ('calculates the intersection of two `Line`s', () => {

            const line1 = Line.fromPointSlopeForm(geometryService.factory.point(0, 2), 2);
            const line2 = Line.fromPointSlopeForm(geometryService.factory.point(0, -2), 3);

            expect(line1.intersection(line2)).toEqual(geometryService.factory.point(4, 10));
        });

        it ('returns undefined if the slopes are the same', () => {

            const line1 = Line.fromPointSlopeForm(geometryService.factory.point(0, 2), 2);
            const line2 = Line.fromPointSlopeForm(geometryService.factory.point(0, -2), 2);

            expect(line1.intersection(line2)).toEqual(undefined);
        });

        it ('works if one of the `Line`s is vertical', () => {
            const line1 = Line.fromPointSlopeForm(geometryService.factory.point(0, 2), undefined);
            const line2 = Line.fromPointSlopeForm(geometryService.factory.point(0, -2), 2);

            expect(line1.intersection(line2)).toEqual(geometryService.factory.point(0, -2));
            expect(line2.intersection(line1)).toEqual(geometryService.factory.point(0, -2));
        });
    });

    describe(`getSegmentWithCenterPointAndDistance`, () => {
        it ('returns the two endpoints of a segment given the center `Point` and the distance from the center.', () => {
            const center1 = geometryService.factory.point(4, 3);
            const line45deg = Line.fromPointSlopeForm(center1, 1);

            expect(line45deg.getSegmentWithCenterPointAndDistance(center1, Math.SQRT2)).toEqual([geometryService.factory.point(5, 4), geometryService.factory.point(3, 2)]);

            const center2 = geometryService.factory.point(4, 3);
            const lineVertical = Line.createVerticalLine(4);

            expect(lineVertical.getSegmentWithCenterPointAndDistance(center2, 1)).toEqual([geometryService.factory.point(4, 2), geometryService.factory.point(4, 4)]);

            const center3 = geometryService.factory.point(2, 4);
            const lineHorizontal = Line.createHorizontalLine(4);

            expect(lineHorizontal.getSegmentWithCenterPointAndDistance(center3, 2)).toEqual([geometryService.factory.point(0, 4), geometryService.factory.point(4, 4)]);
        });
    });

    describe(`getAngleToXAxis`, () => {
        it ('returns with the line\'s angle to the x axis', () => {
            const line45deg = Line.fromPointSlopeForm(geometryService.factory.point(0, 0), 1);

            expect(toDegree(line45deg.getAngleToXAxis().getAngle())).toEqual(45);

            const lineHorizontal = Line.createHorizontalLine(1);

            expect(toDegree(lineHorizontal.getAngleToXAxis().getAngle())).toEqual(0);

            const lineVertical = Line.createVerticalLine(-2);

            expect(toDegree(lineVertical.getAngleToXAxis().getAngle())).toEqual(90);

            const lineneg45Deg = Line.fromPointSlopeForm(geometryService.factory.point(0, 0), -1);

            expect(toDegree(lineneg45Deg.getAngleToXAxis().getAngle())).toEqual(315);
        });
    });
});
