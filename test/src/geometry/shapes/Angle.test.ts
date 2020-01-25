import { toDegree, Angle } from "../../../../src/model/geometry/shapes/Angle";
import { toRadian, Measurements } from "../../../../src/model/geometry/utils/Measurements";
import { Line } from '../../../../src/model/geometry/shapes/Line';
import { Point } from "../../../../src/model/geometry/shapes/Point";
import { Segment } from "../../../../src/model/geometry/shapes/Segment";

describe(`Angle`, () => {

    describe('fromRadian', () => {
        it ('creates a new Angle instance based on the given radian angle', () => {
            const angle0 = 0;

            expect(Angle.fromRadian(angle0).getAngle()).toBeCloseTo(0);

            const angle90 = Math.PI / 2;

            expect(toDegree(Angle.fromRadian(angle90).getAngle())).toBeCloseTo(90);

            const angle180 = Math.PI;

            expect(toDegree(Angle.fromRadian(angle180).getAngle())).toBeCloseTo(180);

            const angleNeg90 = - Math.PI / 2;

            expect(toDegree(Angle.fromRadian(angleNeg90).getAngle())).toBeCloseTo(270);

            const angle240 = toRadian(240);

            expect(toDegree(Angle.fromRadian(angle240).getAngle())).toBeCloseTo(240);

            const angle270 = 3 * Math.PI / 2;

            expect(toDegree(Angle.fromRadian(angle270).getAngle())).toBeCloseTo(270);

            const angle300 = toRadian(300);

            expect(toDegree(Angle.fromRadian(angle300).getAngle())).toBeCloseTo(300);

            const angle510 = toRadian(510);

            expect(toDegree(Angle.fromRadian(angle510).getAngle())).toBeCloseTo(150);

            const angleNeg380 = toRadian(-380);

            expect(toDegree(Angle.fromRadian(angleNeg380).getAngle())).toBeCloseTo(340);
        });
    });

    describe(`getAngle`, () => {
        it ('returns the angle in radian', () => {
            expect(Angle.fromThreePoints(
                new Point(1, 1),
                new Point(1, 3),
                new Point(1, 3)
            ).getAngle()).toEqual(0);

            expect(Angle.fromThreePoints(
                new Point(1, 1),
                new Point(1, 3),
                new Point(3, 1)).getAngle()
            ).toEqual(Math.PI / 2);

            expect(Angle.fromThreePoints(
                new Point(1, 1),
                new Point(-2, 1),
                new Point(3, 1)
            ).getAngle()).toEqual(Math.PI);

            expect(Angle.fromThreePoints(
                new Point(0, 0),
                new Point(0, -1),
                new Point(3, 0)
            ).getAngle()).toEqual(3 * Math.PI / 2);
        });
    });


    describe(`isStraightAngle`, () => {
        it ('returns true if the angle is a straight line', () => {
            const a = new Point(1, 1);
            const b = new Point(2, 2);
            const c = new Point(3, 3);

            const angle = Angle.fromThreePoints(a, b, c);

            expect(angle.isStraightAngle()).toEqual(true);
        });
    });

    describe(`isPointInsideAngle`, () => {
        it ('returns true if the given `Point` is inside the angle (test 45 deg)', () => {
            const angle45deg = Angle.fromThreePoints(
                new Point(0, 0),
                new Point(1, 1),
                new Point(1, 0)
            );

            expect(angle45deg.isPointInsideAngle(new Point(2, 1))).toBeTruthy();

            expect(angle45deg.isPointInsideAngle(new Point(1, 1))).toBeFalsy();

            expect(angle45deg.isPointInsideAngle(new Point(-1, 2))).toBeFalsy();

            expect(angle45deg.isPointInsideAngle(new Point(-1, 1))).toBeFalsy();

            expect(angle45deg.isPointInsideAngle(new Point(-2, 1))).toBeFalsy();

            expect(angle45deg.isPointInsideAngle(new Point(-1, -1))).toBeFalsy();

            expect(angle45deg.isPointInsideAngle(new Point(1, -1))).toBeFalsy();

            expect(angle45deg.isPointInsideAngle(new Point(1, 0))).toBeFalsy();
        });

        it ('returns true if the given `Point` is inside the angle (test 90 deg)', () => {
            const angle90deg = Angle.fromThreePoints(
                new Point(0, 0),
                new Point(0, 1),
                new Point(1, 0)
            );

            expect(angle90deg.isPointInsideAngle(new Point(2, 1))).toBeTruthy();

            expect(angle90deg.isPointInsideAngle(new Point(1, 1))).toBeTruthy();

            expect(angle90deg.isPointInsideAngle(new Point(-1, 2))).toBeFalsy();

            expect(angle90deg.isPointInsideAngle(new Point(-1, 1))).toBeFalsy();

            expect(angle90deg.isPointInsideAngle(new Point(-2, 1))).toBeFalsy();

            expect(angle90deg.isPointInsideAngle(new Point(-1, -1))).toBeFalsy();

            expect(angle90deg.isPointInsideAngle(new Point(1, -1))).toBeFalsy();

            expect(angle90deg.isPointInsideAngle(new Point(1, 0))).toBeFalsy();
        });

        it ('returns true if the given `Point` is inside the angle (test 135 deg)', () => {
            const angle135deg = Angle.fromThreePoints(
                new Point(0, 0),
                new Point(-1, 1),
                new Point(1, 0)
            );

            expect(angle135deg.isPointInsideAngle(new Point(2, 1))).toBeTruthy();

            expect(angle135deg.isPointInsideAngle(new Point(1, 1))).toBeTruthy();

            expect(angle135deg.isPointInsideAngle(new Point(-1, 2))).toBeTruthy();

            expect(angle135deg.isPointInsideAngle(new Point(-1, 1))).toBeFalsy();

            expect(angle135deg.isPointInsideAngle(new Point(-2, 1))).toBeFalsy();

            expect(angle135deg.isPointInsideAngle(new Point(-1, -1))).toBeFalsy();

            expect(angle135deg.isPointInsideAngle(new Point(1, -1))).toBeFalsy();

            expect(angle135deg.isPointInsideAngle(new Point(1, 0))).toBeFalsy();
        });
    });

    describe('fromTwoLines', () => {
        describe('returns an Angle instance', () => {
            it ('when the angle is 45 deg', () => {

                const segment1 = new Segment(new Point(0, 0), new Point(1, 1));
                const segment2 = new Segment(new Point(0, 0), new Point(1, 0));

                let angle = Angle.fromTwoLines(segment1.getLine(), segment2.getLine());
                expect(new Measurements().anglesEqual(angle, Angle.fromRadian(toRadian(45))));
            });

            it ('when one of the lines is parallel to the y axis', () => {
                let angle90 = Angle.fromTwoLines(Line.createVerticalLine(2), Line.createHorizontalLine(2));
                expect(new Measurements().anglesEqual(angle90, Angle.fromRadian(toRadian(90))));


                const line1 = Line.createVerticalLine(1);
                const line2 = new Segment(new Point(0, 0), new Point(1, 1));
                let angle45 = Angle.fromTwoLines(line1, line2.getLine());

                expect(new Measurements().anglesEqual(angle45, Angle.fromRadian(toRadian(45))));
            });

            it ('when the lines are parallel', () => {
                const line1 = new Segment(new Point(0, 0), new Point(1, 1));
                const line2 = new Segment(new Point(0, 1), new Point(1, 2));

                let angle = Angle.fromTwoLines(line1.getLine(), line2.getLine());
                expect(angle).toEqual(undefined);
            });
        });
    });
});
