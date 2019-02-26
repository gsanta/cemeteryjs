import { Polygon } from './Polygon';
import { Point } from './Point';
import { expect } from 'chai';


describe('Polygon', () => {
    describe('overlaps', () => {
        it ('returns with an object if two polygons intersect', () => {
            const poly1 = new Polygon([
                new Point(1, 1),
                new Point(3, 1),
                new Point(3, 4),
                new Point(1, 4)
            ]);

            const poly2 = new Polygon([
                new Point(2, 1),
                new Point(4, 1),
                new Point(4, 4),
                new Point(2, 4)
            ]);

            expect(poly1.overlaps(poly2)).to.eql(true);
        });

        it ('returns with an object containing the intersection line if two polygons intersect at a border', () => {
            const poly1 = new Polygon([
                new Point(1, 1),
                new Point(3, 1),
                new Point(3, 4),
                new Point(1, 4)
            ]);

            const poly2 = new Polygon([
                new Point(3, 1),
                new Point(4, 1),
                new Point(4, 4),
                new Point(3, 4)
            ]);

            expect(poly1.overlaps(poly2)).to.eql(false);
        });

        it ('returns false if two polygons do not intersect', () => {
            const poly1 = new Polygon([
                new Point(1, 1),
                new Point(3, 1),
                new Point(3, 4),
                new Point(1, 4)
            ]);

            const poly2 = new Polygon([
                new Point(4, 1),
                new Point(5, 1),
                new Point(5, 4),
                new Point(4, 4)
            ]);

            expect(poly1.overlaps(poly2)).to.eql(false);
        });
    });
});