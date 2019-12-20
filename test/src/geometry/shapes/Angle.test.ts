import { toDegree } from "../../../../src/model/geometry/shapes/Angle";
import { toRadian } from "../../../../src/model/geometry/utils/Measurements";
import { Line } from '../../../../src/model/geometry/shapes/Line';
import { GeometryService } from "../../../../src/model/geometry/GeometryService";

describe(`Angle`, () => {
    const geometryService = new GeometryService();

    describe('fromRadian', () => {
        it ('creates a new Angle instance based on the given radian angle', () => {
            const angle0 = 0;

            expect(geometryService.factory.angleFromRadian(angle0).getAngle()).toBeCloseTo(0);

            const angle90 = Math.PI / 2;

            expect(toDegree(geometryService.factory.angleFromRadian(angle90).getAngle())).toBeCloseTo(90);

            const angle180 = Math.PI;

            expect(toDegree(geometryService.factory.angleFromRadian(angle180).getAngle())).toBeCloseTo(180);

            const angleNeg90 = - Math.PI / 2;

            expect(toDegree(geometryService.factory.angleFromRadian(angleNeg90).getAngle())).toBeCloseTo(270);

            const angle240 = toRadian(240);

            expect(toDegree(geometryService.factory.angleFromRadian(angle240).getAngle())).toBeCloseTo(240);

            const angle270 = 3 * Math.PI / 2;

            expect(toDegree(geometryService.factory.angleFromRadian(angle270).getAngle())).toBeCloseTo(270);

            const angle300 = toRadian(300);

            expect(toDegree(geometryService.factory.angleFromRadian(angle300).getAngle())).toBeCloseTo(300);

            const angle510 = toRadian(510);

            expect(toDegree(geometryService.factory.angleFromRadian(angle510).getAngle())).toBeCloseTo(150);

            const angleNeg380 = toRadian(-380);

            expect(toDegree(geometryService.factory.angleFromRadian(angleNeg380).getAngle())).toBeCloseTo(340);
        });
    });

    describe(`getAngle`, () => {
        it ('returns the angle in radian', () => {
            const geometryService = new GeometryService();

            expect(geometryService.factory.angleFromThreePoints(
                geometryService.factory.point(1, 1),
                geometryService.factory.point(1, 3),
                geometryService.factory.point(1, 3)
            ).getAngle()).toEqual(0);

            expect(geometryService.factory.angleFromThreePoints(
                geometryService.factory.point(1, 1),
                geometryService.factory.point(1, 3),
                geometryService.factory.point(3, 1)).getAngle()
            ).toEqual(Math.PI / 2);

            expect(geometryService.factory.angleFromThreePoints(
                geometryService.factory.point(1, 1),
                geometryService.factory.point(-2, 1),
                geometryService.factory.point(3, 1)
            ).getAngle()).toEqual(Math.PI);

            expect(geometryService.factory.angleFromThreePoints(
                geometryService.factory.point(0, 0),
                geometryService.factory.point(0, -1),
                geometryService.factory.point(3, 0)
            ).getAngle()).toEqual(3 * Math.PI / 2);
        });
    });


    describe(`isStraightAngle`, () => {
        it ('returns true if the angle is a straight line', () => {
            const geometryService = new GeometryService();

            const a = geometryService.factory.point(1, 1);
            const b = geometryService.factory.point(2, 2);
            const c = geometryService.factory.point(3, 3);

            const angle = geometryService.factory.angleFromThreePoints(a, b, c);

            expect(angle.isStraightAngle()).toEqual(true);
        });
    });

    describe(`isPointInsideAngle`, () => {
        it ('returns true if the given `Point` is inside the angle (test 45 deg)', () => {
            const geometryService = new GeometryService();

            const angle45deg = geometryService.factory.angleFromThreePoints(
                geometryService.factory.point(0, 0),
                geometryService.factory.point(1, 1),
                geometryService.factory.point(1, 0)
            );

            expect(angle45deg.isPointInsideAngle(geometryService.factory.point(2, 1))).toBeTruthy();

            expect(angle45deg.isPointInsideAngle(geometryService.factory.point(1, 1))).toBeFalsy();

            expect(angle45deg.isPointInsideAngle(geometryService.factory.point(-1, 2))).toBeFalsy();

            expect(angle45deg.isPointInsideAngle(geometryService.factory.point(-1, 1))).toBeFalsy();

            expect(angle45deg.isPointInsideAngle(geometryService.factory.point(-2, 1))).toBeFalsy();

            expect(angle45deg.isPointInsideAngle(geometryService.factory.point(-1, -1))).toBeFalsy();

            expect(angle45deg.isPointInsideAngle(geometryService.factory.point(1, -1))).toBeFalsy();

            expect(angle45deg.isPointInsideAngle(geometryService.factory.point(1, 0))).toBeFalsy();
        });

        it ('returns true if the given `Point` is inside the angle (test 90 deg)', () => {
            const geometryService = new GeometryService();

            const angle90deg = geometryService.factory.angleFromThreePoints(
                geometryService.factory.point(0, 0),
                geometryService.factory.point(0, 1),
                geometryService.factory.point(1, 0)
            );

            expect(angle90deg.isPointInsideAngle(geometryService.factory.point(2, 1))).toBeTruthy();

            expect(angle90deg.isPointInsideAngle(geometryService.factory.point(1, 1))).toBeTruthy();

            expect(angle90deg.isPointInsideAngle(geometryService.factory.point(-1, 2))).toBeFalsy();

            expect(angle90deg.isPointInsideAngle(geometryService.factory.point(-1, 1))).toBeFalsy();

            expect(angle90deg.isPointInsideAngle(geometryService.factory.point(-2, 1))).toBeFalsy();

            expect(angle90deg.isPointInsideAngle(geometryService.factory.point(-1, -1))).toBeFalsy();

            expect(angle90deg.isPointInsideAngle(geometryService.factory.point(1, -1))).toBeFalsy();

            expect(angle90deg.isPointInsideAngle(geometryService.factory.point(1, 0))).toBeFalsy();
        });

        it ('returns true if the given `Point` is inside the angle (test 135 deg)', () => {
            const geometryService = new GeometryService();

            const angle135deg = geometryService.factory.angleFromThreePoints(
                geometryService.factory.point(0, 0),
                geometryService.factory.point(-1, 1),
                geometryService.factory.point(1, 0)
            );

            expect(angle135deg.isPointInsideAngle(geometryService.factory.point(2, 1))).toBeTruthy();

            expect(angle135deg.isPointInsideAngle(geometryService.factory.point(1, 1))).toBeTruthy();

            expect(angle135deg.isPointInsideAngle(geometryService.factory.point(-1, 2))).toBeTruthy();

            expect(angle135deg.isPointInsideAngle(geometryService.factory.point(-1, 1))).toBeFalsy();

            expect(angle135deg.isPointInsideAngle(geometryService.factory.point(-2, 1))).toBeFalsy();

            expect(angle135deg.isPointInsideAngle(geometryService.factory.point(-1, -1))).toBeFalsy();

            expect(angle135deg.isPointInsideAngle(geometryService.factory.point(1, -1))).toBeFalsy();

            expect(angle135deg.isPointInsideAngle(geometryService.factory.point(1, 0))).toBeFalsy();
        });
    });

    describe('fromTwoLines', () => {
        describe('returns an Angle instance', () => {
            it ('when the angle is 45 deg', () => {

                const segment1 = geometryService.factory.edge(geometryService.factory.point(0, 0), geometryService.factory.point(1, 1));
                const segment2 = geometryService.factory.edge(geometryService.factory.point(0, 0), geometryService.factory.point(1, 0));

                let angle = geometryService.factory.angleFromTwoLines(segment1.getLine(), segment2.getLine());
                expect(geometryService.measuerments.anglesEqual(angle, geometryService.factory.angleFromRadian(toRadian(45))));
            });

            it ('when one of the lines is parallel to the y axis', () => {
                const geometryService = new GeometryService();

                let angle90 = geometryService.factory.angleFromTwoLines(Line.createVerticalLine(2), Line.createHorizontalLine(2));
                expect(geometryService.measuerments.anglesEqual(angle90, geometryService.factory.angleFromRadian(toRadian(90))));


                const line1 = Line.createVerticalLine(1);
                const line2 = geometryService.factory.edge(geometryService.factory.point(0, 0), geometryService.factory.point(1, 1));
                let angle45 = geometryService.factory.angleFromTwoLines(line1, line2.getLine());

                expect(geometryService.measuerments.anglesEqual(angle45, geometryService.factory.angleFromRadian(toRadian(45))));
            });

            it ('when the lines are parallel', () => {
                const geometryService = new GeometryService();

                const line1 = geometryService.factory.edge(geometryService.factory.point(0, 0), geometryService.factory.point(1, 1));
                const line2 = geometryService.factory.edge(geometryService.factory.point(0, 1), geometryService.factory.point(1, 2));

                let angle = geometryService.factory.angleFromTwoLines(line1.getLine(), line2.getLine());
                expect(angle).toEqual(undefined);
            });
        });
    });
});
