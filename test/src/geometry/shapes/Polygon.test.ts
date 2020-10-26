import { Rectangle } from "../../../../src/utils/geometry/shapes/Rectangle";
import { Point } from "../../../../src/utils/geometry/shapes/Point";
import { Polygon } from "../../../../src/utils/geometry/shapes/Polygon";
import { LineSegment } from "../../../../src/utils/geometry/shapes/LineSegment";

describe('Polygon', () => {
    describe('contains', () => {
        it ('returns true if the polygon contains the other', () => {
            const poly1 = new Polygon([
                new Point(1, 1),
                new Point(3, 1),
                new Point(3, 4),
                new Point(1, 4)
            ]);

            const poly2 = new Polygon([
                new Point(2, 1),
                new Point(3, 1),
                new Point(3, 4),
                new Point(2, 4)
            ]);

            expect(poly1.contains(poly2)).toEqual(true);
        });

        it ('returns false if the two polygons overlap', () => {
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

            expect(poly1.contains(poly2)).toBeFalsy();
        });

        it ('returns false if the two polygons do have any common parts', () => {
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

            expect(poly1.contains(poly2)).toBeFalsy();
        });
    });

    describe('intersect', () => {
        it ('returns true if the two polygons overlap', () => {
            const poly1 = new Polygon([
                new Point(1, 1),
                new Point(4, 1),
                new Point(4, 4),
                new Point(1, 4)
            ]);

            const poly2 = new Polygon([
                new Point(3, 1),
                new Point(5, 1),
                new Point(5, 4),
                new Point(3, 4)
            ]);

            expect(poly1.intersect(poly2)).toBeTruthy();
        });

        it ('returns true if the two polygons intersect at an edge', () => {
            const poly1 = new Polygon([
                new Point(1, 1),
                new Point(4, 1),
                new Point(4, 4),
                new Point(1, 4)
            ]);

            const poly2 = new Polygon([
                new Point(4, 1),
                new Point(5, 1),
                new Point(5, 4),
                new Point(4, 4)
            ])

            expect(poly1.intersect(poly2)).toBeTruthy();
        });

        it ('returns false if the two polygons do not intersect', () => {
            const poly1 = new Polygon([
                new Point(1, 1),
                new Point(4, 1),
                new Point(4, 4),
                new Point(1, 4)
            ]);

            const poly2 = new Polygon([
                new Point(5, 1),
                new Point(6, 1),
                new Point(6, 4),
                new Point(5, 4)
            ])

            expect(poly1.intersect(poly2)).toBeFalsy();
        });
    });

    describe(`scale`, () => {
        it ('scales the `Polygon` by the given x', () => {
            const polygon = new Polygon([
                new Point(1, 0),
                new Point(1, 2),
                new Point(4, 2),
                new Point(4, 0)
            ]);
            expect(
                polygon.scale(new Point(3, 1)).equalTo(
                    new Polygon([
                        new Point(3, 0),
                        new Point(3, 2),
                        new Point(12, 2),
                        new Point(12, 0)
                    ])
                )
            ).toBeTruthy();
        });

        it ('scales the `Polygon` by the given y', () => {
            const polygon = new Polygon([
                new Point(1, 0),
                new Point(1, 2),
                new Point(4, 2),
                new Point(4, 0)
            ]);

            expect(
                polygon.scale(new Point(1, 3)).equalTo(
                    new Polygon([
                        new Point(1, 0),
                        new Point(1, 6),
                        new Point(4, 6),
                        new Point(4, 0)
                    ])
                )
            ).toBeTruthy();
        });
    });

    describe('equalTo', () => {
        it ('returns true if all of the points in the polygon are equal', () => {
            const polygon1 = new Polygon([new Point(1, 2), new Point(3, 4), new Point(5, 6)]);
            const polygon2 = new Polygon([new Point(1, 2), new Point(3, 4), new Point(5, 6)]);

            expect(polygon1.equalTo(polygon2)).toBeTruthy();
        });

        it ('returns false it not all the points are equal', () => {
            const polygon1 = new Polygon([new Point(1, 2), new Point(5, 4), new Point(5, 6)]);
            const polygon2 = new Polygon([new Point(1, 2), new Point(3, 4), new Point(5, 6)]);

            expect(polygon1.equalTo(polygon2)).toBeFalsy();
        });

        it ('returns false it the two polygons do not have the same number of points', () => {
            const polygon1 = new Polygon([new Point(1, 2), new Point(3, 4)]);
            const polygon2 = new Polygon([new Point(1, 2), new Point(3, 4), new Point(5, 6)]);

            expect(polygon1.equalTo(polygon2)).toBeFalsy();
        });
    });

    describe(`translate`, () => {
        it ('trasnlates it by the given amount of x coordinate', () => {
            const polygon = new Polygon([
                new Point(2, 3),
                new Point(5, 3),
                new Point(5, 6),
                new Point(4, 7),
                new Point(2, 7)
            ]);

            const expectedPolygon = new Polygon([
                new Point(5, 3),
                new Point(8, 3),
                new Point(8, 6),
                new Point(7, 7),
                new Point(5, 7)
            ]);

            expect(polygon.translate(new Point(3, 0)).equalTo(expectedPolygon)).toBeTruthy();
        });

        it ('trasnlates it by the given amount of y coordinate', () => {
            const polygon = new Polygon([
                new Point(2, 3),
                new Point(5, 3),
                new Point(5, 6),
                new Point(4, 7),
                new Point(2, 7)
            ]);

            const expectedPolygon = new Polygon([
                new Point(2, 0),
                new Point(5, 0),
                new Point(5, 3),
                new Point(4, 4),
                new Point(2, 4)
            ]);

            expect(polygon.translate(new Point(0, -3)).equalTo(expectedPolygon)).toBeTruthy();
        });
    });

    describe('getArea', () => {
        it ('calculates the area of the polygon', () => {
            const polygon = new Polygon([
                new Point(4, 6),
                new Point(4, -4),
                new Point(8, -4),
                new Point(8, -8),
                new Point(-4, -8),
                new Point(-4, 6)
            ]);

            expect(polygon.getArea()).toEqual(128);
        });
    });

    describe(`createRectangle`, () => {
        it ('creates a `Polygon` which has the features of a rectangle.', () => {
            const rectangle = Polygon.createRectangle(3, 5, 3, 2);

            expect(
                rectangle.equalTo(
                    new Polygon([
                        new Point(3, 5),
                        new Point(3, 7),
                        new Point(6, 7),
                        new Point(6, 5)
                    ])
                )
            ).toBeTruthy();
        });
    });

    describe(`removeStraightVertices`, () => {
        it ('removes the points from the `Polygon` which form a straight angle between the prev and next `Point`s', () => {
            const polygon = new Polygon([
                new Point(1, 1),
                new Point(1, 3),
                new Point(1, 5),
                new Point(4, 5),
                new Point(6, 5),
                new Point(7, 5),
                new Point(7, 1),
            ]);

            expect(
                polygon.removeStraightVertices().equalTo(
                    new Polygon([
                        new Point(1, 1),
                        new Point(1, 5),
                        new Point(7, 5),
                        new Point(7, 1),
                    ])
                )
            ).toBeTruthy()
        });
    });

    describe('toString', () => {
        it ('creates a string representation of the `Polygon`', () => {
            const polygon = new Polygon([
                new Point(3, 5),
                new Point(3, 7),
                new Point(6, 7),
                new Point(6, 5)
            ]);

            expect(polygon.toString()).toEqual('[(3:5),(3:7),(6:7),(6:5)]');
        });
    });
});