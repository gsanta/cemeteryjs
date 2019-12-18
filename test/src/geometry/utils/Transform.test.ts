import { Transform } from '../../../../src/geometry/utils/Transform';
import { Polygon } from '../../../../src/geometry/shapes/Polygon';
import { Point } from '../../../../src/geometry/shapes/Point';
import { Segment } from '../../../../src/geometry/shapes/Segment';


describe(`Transform`, () => {
    describe(`rotate`, () => {
        it ('rotates the `Polygon` with the given degree at the center', () => {
            const transform = new Transform();

            const polygon = Polygon.createRectangle(1, 1, 3, 2);
            const rot1 = transform.rotatePolygon(polygon, Math.PI / 2);

            expect(
                rot1.equalTo(
                    new Polygon([
                        new Point(1.5, 0.5),
                        new Point(1.5, 3.5),
                        new Point(3.5, 3.5),
                        new Point(3.5, 0.5)
                    ])
                )
            ).toBeTruthy();
        });

        it ('rotates the `Segment` with the given degree at the center', () => {
            const transform = new Transform();


            const segmentHorizontal = new Segment(new Point(1, 2), new Point(3, 2));
            expect(transform.rotateSegment(segmentHorizontal, Math.PI / 2)).toEqual(new Segment(new Point(2, 1), new Point(2, 3)));

            const verticalSegment = new Segment(new Point(0, -2), new Point(0, 2));
            const segmnentRotated90deg =  transform.rotateSegment(verticalSegment, Math.PI / 2);
            expect(segmnentRotated90deg.getPoints()[0].x).toBeCloseTo(2);
            expect(segmnentRotated90deg.getPoints()[0].y).toBeCloseTo(0);
            expect(segmnentRotated90deg.getPoints()[1].x).toBeCloseTo(-2);
            expect(segmnentRotated90deg.getPoints()[1].y).toBeCloseTo(0);

            const verticalSegment2 = new Segment(new Point(-Math.SQRT2, 0), new Point(Math.SQRT2, 0));
            const segmentRotated45deg = transform.rotateSegment(verticalSegment2, Math.PI / 4);
            expect(segmentRotated45deg.getPoints()[0].x).toBeCloseTo(-1);
            expect(segmentRotated45deg.getPoints()[0].y).toBeCloseTo(-1);
            expect(segmentRotated45deg.getPoints()[1].x).toBeCloseTo(1);
            expect(segmentRotated45deg.getPoints()[1].y).toBeCloseTo(1);
        });
    });
});
