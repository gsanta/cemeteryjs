import { Distance } from "../../../../src/utils/geometry/Distance";
import { Point } from "../../../../src/utils/geometry/shapes/Point";
import { Segment } from "../../../../src/utils/geometry/shapes/Segment";



describe(`Distance`, () => {
    describe(`pointToSegment`, () => {
        it ('calculates the min distance between the `Point` and the `Segment`', () => {
            const distance = new Distance();
            expect(distance.pointToSegment(new Point(2, 4), new Segment(new Point(0, 5), new Point(0, 3)))).toEqual(2);

            expect(distance.pointToSegment(new Point(3, 5), new Segment(new Point(0, 5), new Point(0, 3)))).toEqual(3);

            expect(distance.pointToSegment(new Point(4, 1), new Segment(new Point(1, 1), new Point(3, 1)))).toEqual(1);
        });
    });
});
