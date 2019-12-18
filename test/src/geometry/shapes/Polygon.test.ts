import { GeometryService } from "../../../../src/geometry/GeometryService";
import { Rectangle } from "../../../../src/geometry/shapes/Rectangle";
import { Point } from "../../../../src/geometry/shapes/Point";
import { Polygon } from "../../../../src/geometry/shapes/Polygon";

describe('Polygon', () => {

    const geometryService = new GeometryService();

    describe(`setPoint`, () => {
        it ('sets the given `Point` and returns with the new `Shape`', () => {
            let polygon = geometryService.factory.polygon([
                geometryService.factory.point(1, 1),
                geometryService.factory.point(1, 2),
                geometryService.factory.point(3, 2),
                geometryService.factory.point(3, 1)
            ]);

            polygon = polygon.setPoint(2, geometryService.factory.point(3, 3));

            expect(polygon.equalTo(
                geometryService.factory.polygon([
                    geometryService.factory.point(1, 1),
                    geometryService.factory.point(1, 2),
                    geometryService.factory.point(3, 3),
                    geometryService.factory.point(3, 1)
            ]))).toBeTruthy();
        });
    });

    describe('containsPoint', () => {
        it ('returns true if the point is inside of the polygon', () => {
            const point = new Point(2, 2);
            const polygon = new Rectangle(new Point(1, 1), new Point(3, 3));

            expect(polygon.containsPoint(point)).toBeTruthy();
        });

        it ('returns false if the point is not inside of the polygon', () => {
            const point = new Point(0, 0);
            const polygon = new Rectangle(new Point(1, 1), new Point(3, 3));

            expect(polygon.containsPoint(point)).toBeFalsy();
        });

        it ('returns false if the point only intersets the polygon', () => {
            const point = new Point(1, 2);
            const polygon = new Rectangle(new Point(1, 1), new Point(3, 3));

            expect(polygon.containsPoint(point)).toBeFalsy();
        });
    });

    describe('contains', () => {
        it ('returns true if the polygon contains the other', () => {
            const poly1 = geometryService.factory.polygon([
                geometryService.factory.point(1, 1),
                geometryService.factory.point(3, 1),
                geometryService.factory.point(3, 4),
                geometryService.factory.point(1, 4)
            ]);

            const poly2 = geometryService.factory.polygon([
                geometryService.factory.point(2, 1),
                geometryService.factory.point(3, 1),
                geometryService.factory.point(3, 4),
                geometryService.factory.point(2, 4)
            ]);

            expect(poly1.contains(poly2)).toEqual(true);
        });

        it ('returns false if the two polygons overlap', () => {
            const poly1 = geometryService.factory.polygon([
                geometryService.factory.point(1, 1),
                geometryService.factory.point(3, 1),
                geometryService.factory.point(3, 4),
                geometryService.factory.point(1, 4)
            ]);

            const poly2 = geometryService.factory.polygon([
                geometryService.factory.point(2, 1),
                geometryService.factory.point(4, 1),
                geometryService.factory.point(4, 4),
                geometryService.factory.point(2, 4)
            ]);

            expect(poly1.contains(poly2)).toBeFalsy();
        });

        it ('returns false if the two polygons do have any common parts', () => {
            const poly1 = geometryService.factory.polygon([
                geometryService.factory.point(1, 1),
                geometryService.factory.point(3, 1),
                geometryService.factory.point(3, 4),
                geometryService.factory.point(1, 4)
            ]);

            const poly2 = geometryService.factory.polygon([
                geometryService.factory.point(4, 1),
                geometryService.factory.point(5, 1),
                geometryService.factory.point(5, 4),
                geometryService.factory.point(4, 4)
            ]);

            expect(poly1.contains(poly2)).toBeFalsy();
        });
    });

    describe('intersect', () => {
        it ('returns true if the two polygons overlap', () => {
            const poly1 = geometryService.factory.polygon([
                geometryService.factory.point(1, 1),
                geometryService.factory.point(4, 1),
                geometryService.factory.point(4, 4),
                geometryService.factory.point(1, 4)
            ]);

            const poly2 = geometryService.factory.polygon([
                geometryService.factory.point(3, 1),
                geometryService.factory.point(5, 1),
                geometryService.factory.point(5, 4),
                geometryService.factory.point(3, 4)
            ]);

            expect(poly1.intersect(poly2)).toBeTruthy();
        });

        it ('returns true if the two polygons intersect at an edge', () => {
            const poly1 = geometryService.factory.polygon([
                geometryService.factory.point(1, 1),
                geometryService.factory.point(4, 1),
                geometryService.factory.point(4, 4),
                geometryService.factory.point(1, 4)
            ]);

            const poly2 = geometryService.factory.polygon([
                geometryService.factory.point(4, 1),
                geometryService.factory.point(5, 1),
                geometryService.factory.point(5, 4),
                geometryService.factory.point(4, 4)
            ])

            expect(poly1.intersect(poly2)).toBeTruthy();
        });

        it ('returns false if the two polygons do not intersect', () => {
            const poly1 = geometryService.factory.polygon([
                geometryService.factory.point(1, 1),
                geometryService.factory.point(4, 1),
                geometryService.factory.point(4, 4),
                geometryService.factory.point(1, 4)
            ]);

            const poly2 = geometryService.factory.polygon([
                geometryService.factory.point(5, 1),
                geometryService.factory.point(6, 1),
                geometryService.factory.point(6, 4),
                geometryService.factory.point(5, 4)
            ])

            expect(poly1.intersect(poly2)).toBeFalsy();
        });
    });

    describe('`getCoincidentLineSegment`', () => {
        it ('returns with the common `Segment` segment if the `Polygon` has a common edge with the other `Shape`', () => {
            const poly1 = geometryService.factory.polygon([
                geometryService.factory.point(1, 1),
                geometryService.factory.point(1, 4),
                geometryService.factory.point(3, 4),
                geometryService.factory.point(3, 1)
            ]);

            const poly2 = geometryService.factory.polygon([
                geometryService.factory.point(3, 1),
                geometryService.factory.point(3, 4),
                geometryService.factory.point(4, 4),
                geometryService.factory.point(4, 1)
            ]);

            expect(poly1.getCoincidentLineSegment(poly2)).toEqual([geometryService.factory.edge(geometryService.factory.point(3, 1), geometryService.factory.point(3, 4)), 2, 0]);
        });

        it ('returns undefined if the two `Shape`s don\'t have common edges', () => {
            const poly1 = geometryService.factory.polygon([
                geometryService.factory.point(1, 1),
                geometryService.factory.point(1, 4),
                geometryService.factory.point(3, 4),
                geometryService.factory.point(3, 1)
            ]);

            const poly2 = geometryService.factory.polygon([
                geometryService.factory.point(4, 1),
                geometryService.factory.point(4, 4),
                geometryService.factory.point(5, 4),
                geometryService.factory.point(5, 1)
            ]);

            expect(poly1.getCoincidentLineSegment(poly2)).toEqual(undefined);
        });

        it ('returns undefined if the two `Shape`s touches only at a vertex.', () => {
            const poly1 = geometryService.factory.polygon([
                geometryService.factory.point(1, 1),
                geometryService.factory.point(1, 4),
                geometryService.factory.point(3, 4),
                geometryService.factory.point(3, 1)
            ]);

            const poly2 = geometryService.factory.polygon([
                geometryService.factory.point(3, 4),
                geometryService.factory.point(3, 6),
                geometryService.factory.point(6, 6),
                geometryService.factory.point(6, 4)
            ]);

            expect(poly1.getCoincidentLineSegment(poly2)).toEqual(undefined);
        });
    });

    describe(`scale`, () => {
        it ('scales the `Polygon` by the given x', () => {
            const polygon = geometryService.factory.polygon([
                geometryService.factory.point(1, 0),
                geometryService.factory.point(1, 2),
                geometryService.factory.point(4, 2),
                geometryService.factory.point(4, 0)
            ]);
            expect(
                polygon.scale(geometryService.factory.point(3, 1)).equalTo(
                    geometryService.factory.polygon([
                        geometryService.factory.point(3, 0),
                        geometryService.factory.point(3, 2),
                        geometryService.factory.point(12, 2),
                        geometryService.factory.point(12, 0)
                    ])
                )
            ).toBeTruthy();
        });

        it ('scales the `Polygon` by the given y', () => {
            const polygon = geometryService.factory.polygon([
                geometryService.factory.point(1, 0),
                geometryService.factory.point(1, 2),
                geometryService.factory.point(4, 2),
                geometryService.factory.point(4, 0)
            ]);

            expect(
                polygon.scale(geometryService.factory.point(1, 3)).equalTo(
                    geometryService.factory.polygon([
                        geometryService.factory.point(1, 0),
                        geometryService.factory.point(1, 6),
                        geometryService.factory.point(4, 6),
                        geometryService.factory.point(4, 0)
                    ])
                )
            ).toBeTruthy();
        });
    });

    describe('equalTo', () => {
        it ('returns true if all of the points in the polygon are equal', () => {
            const polygon1 = geometryService.factory.polygon([geometryService.factory.point(1, 2), geometryService.factory.point(3, 4), geometryService.factory.point(5, 6)]);
            const polygon2 = geometryService.factory.polygon([geometryService.factory.point(1, 2), geometryService.factory.point(3, 4), geometryService.factory.point(5, 6)]);

            expect(polygon1.equalTo(polygon2)).toBeTruthy();
        });

        it ('returns false it not all the points are equal', () => {
            const polygon1 = geometryService.factory.polygon([geometryService.factory.point(1, 2), geometryService.factory.point(5, 4), geometryService.factory.point(5, 6)]);
            const polygon2 = geometryService.factory.polygon([geometryService.factory.point(1, 2), geometryService.factory.point(3, 4), geometryService.factory.point(5, 6)]);

            expect(polygon1.equalTo(polygon2)).toBeFalsy();
        });

        it ('returns false it the two polygons do not have the same number of points', () => {
            const polygon1 = geometryService.factory.polygon([geometryService.factory.point(1, 2), geometryService.factory.point(3, 4)]);
            const polygon2 = geometryService.factory.polygon([geometryService.factory.point(1, 2), geometryService.factory.point(3, 4), geometryService.factory.point(5, 6)]);

            expect(polygon1.equalTo(polygon2)).toBeFalsy();
        });
    });

    describe(`negate`, () => {
        it ('can negate to the x axis', () => {
            const polygon = geometryService.factory.polygon([
                geometryService.factory.point(2, 3),
                geometryService.factory.point(5, 3),
                geometryService.factory.point(5, 6),
                geometryService.factory.point(4, 7),
                geometryService.factory.point(2, 7)
            ]);

            const expectedPolygon = geometryService.factory.polygon([
                geometryService.factory.point(-2, 3),
                geometryService.factory.point(-5, 3),
                geometryService.factory.point(-5, 6),
                geometryService.factory.point(-4, 7),
                geometryService.factory.point(-2, 7)
            ])

            expect(polygon.negate('x').equalTo(expectedPolygon)).toBeTruthy();
        });

        it ('can negate to the y axis', () => {
            const polygon = geometryService.factory.polygon([
                geometryService.factory.point(2, 3),
                geometryService.factory.point(2, 7),
                geometryService.factory.point(4, 7),
                geometryService.factory.point(5, 6),
                geometryService.factory.point(5, 3),
                geometryService.factory.point(2, 3)
            ]);

            const expectedPolygon = geometryService.factory.polygon([
                geometryService.factory.point(2, -3),
                geometryService.factory.point(2, -7),
                geometryService.factory.point(4, -7),
                geometryService.factory.point(5, -6),
                geometryService.factory.point(5, -3),
                geometryService.factory.point(2, -3)
            ])

            expect(polygon.negate('y').equalTo(expectedPolygon)).toBeTruthy();
        });
    });

    describe(`translate`, () => {
        it ('trasnlates it by the given amount of x coordinate', () => {
            const polygon = geometryService.factory.polygon([
                geometryService.factory.point(2, 3),
                geometryService.factory.point(5, 3),
                geometryService.factory.point(5, 6),
                geometryService.factory.point(4, 7),
                geometryService.factory.point(2, 7)
            ]);

            const expectedPolygon = geometryService.factory.polygon([
                geometryService.factory.point(5, 3),
                geometryService.factory.point(8, 3),
                geometryService.factory.point(8, 6),
                geometryService.factory.point(7, 7),
                geometryService.factory.point(5, 7)
            ]);

            expect(polygon.translate(geometryService.factory.point(3, 0)).equalTo(expectedPolygon)).toBeTruthy();
        });

        it ('trasnlates it by the given amount of y coordinate', () => {
            const polygon = geometryService.factory.polygon([
                geometryService.factory.point(2, 3),
                geometryService.factory.point(5, 3),
                geometryService.factory.point(5, 6),
                geometryService.factory.point(4, 7),
                geometryService.factory.point(2, 7)
            ]);

            const expectedPolygon = geometryService.factory.polygon([
                geometryService.factory.point(2, 0),
                geometryService.factory.point(5, 0),
                geometryService.factory.point(5, 3),
                geometryService.factory.point(4, 4),
                geometryService.factory.point(2, 4)
            ]);

            expect(polygon.translate(geometryService.factory.point(0, -3)).equalTo(expectedPolygon)).toBeTruthy();
        });
    });

    describe('getArea', () => {
        it ('calculates the area of the polygon', () => {
            const polygon = geometryService.factory.polygon([
                geometryService.factory.point(4, 6),
                geometryService.factory.point(4, -4),
                geometryService.factory.point(8, -4),
                geometryService.factory.point(8, -8),
                geometryService.factory.point(-4, -8),
                geometryService.factory.point(-4, 6)
            ]);

            expect(polygon.getArea()).toEqual(128);
        });
    });

    describe('`getEdges`', () => {
        it ('returns with a `Segment` array representing the `Polygon` sides from bottom left to clockwise', () => {
            const polygon = geometryService.factory.polygon([
                geometryService.factory.point(1, 1),
                geometryService.factory.point(3, 1),
                geometryService.factory.point(3, 3),
                geometryService.factory.point(1, 3)
            ]);
            expect(polygon.getEdges()).toEqual(
                [
                    geometryService.factory.edge(geometryService.factory.point(1, 1), geometryService.factory.point(1, 3)),
                    geometryService.factory.edge(geometryService.factory.point(1, 3), geometryService.factory.point(3, 3)),
                    geometryService.factory.edge(geometryService.factory.point(3, 3), geometryService.factory.point(3, 1)),
                    geometryService.factory.edge(geometryService.factory.point(3, 1), geometryService.factory.point(1, 1)),
                ]
            )
        });
    });

    describe('`getCoincidingSidesForLine`', () => {
        it ('returns the correct side of the `Polygon` and it\'s index which conincides with the `Segment` given as a parameter.', () => {
            const polygon = geometryService.factory.polygon([
                geometryService.factory.point(5, 5),
                geometryService.factory.point(5, 3),
                geometryService.factory.point(4, 3),
                geometryService.factory.point(4, 2),
                geometryService.factory.point(1, 2),
                geometryService.factory.point(1, 5)
            ]);

            const coincidingSides = polygon.getCoincidingSidesForLine(geometryService.factory.edge(geometryService.factory.point(3, 3), geometryService.factory.point(5, 3)));

            expect(coincidingSides.length).toEqual(1);
            expect(coincidingSides[0]).toEqual([geometryService.factory.edge(geometryService.factory.point(5, 3), geometryService.factory.point(4, 3)), 3]);
        });
    });

    describe('`getBoundingRectangle`', () => {
        it ('calculates the `Rectangle` which surrounds the `Polygon`', () => {
            const polygon = geometryService.factory.polygon([
                geometryService.factory.point(1, 1),
                geometryService.factory.point(1, 3),
                geometryService.factory.point(3, 3),
                geometryService.factory.point(3, 5),
                geometryService.factory.point(6, 5),
                geometryService.factory.point(6, 4),
                geometryService.factory.point(5, 4),
                geometryService.factory.point(5, 1)
            ]);

            const boundingRectangle = polygon.getBoundingRectangle();
            expect(
                boundingRectangle.equalTo(
                    geometryService.factory.polygon([
                        geometryService.factory.point(1, 1),
                        geometryService.factory.point(1, 5),
                        geometryService.factory.point(6, 5),
                        geometryService.factory.point(6, 1)
                    ])
                )
            ).toBeTruthy();
        });

        it ('gives back the same shape if the `Polygon` is already a `Rectangle`', () => {
            const polygon = geometryService.factory.polygon([
                geometryService.factory.point(1, 1),
                geometryService.factory.point(1, 3),
                geometryService.factory.point(3, 3),
                geometryService.factory.point(3, 1)
            ]);

            const boundingRectangle = polygon.getBoundingRectangle();
            expect(boundingRectangle.equalTo(polygon)).toBeTruthy();
        });
    });

    describe(`createRectangle`, () => {
        it ('creates a `Polygon` which has the features of a rectangle.', () => {
            const rectangle = Polygon.createRectangle(3, 5, 3, 2);

            expect(
                rectangle.equalTo(
                    geometryService.factory.polygon([
                        geometryService.factory.point(3, 5),
                        geometryService.factory.point(3, 7),
                        geometryService.factory.point(6, 7),
                        geometryService.factory.point(6, 5)
                    ])
                )
            ).toBeTruthy();
        });
    });

    describe(`removeStraightVertices`, () => {
        it ('removes the points from the `Polygon` which form a straight angle between the prev and next `Point`s', () => {
            const polygon = geometryService.factory.polygon([
                geometryService.factory.point(1, 1),
                geometryService.factory.point(1, 3),
                geometryService.factory.point(1, 5),
                geometryService.factory.point(4, 5),
                geometryService.factory.point(6, 5),
                geometryService.factory.point(7, 5),
                geometryService.factory.point(7, 1),
            ]);

            expect(
                polygon.removeStraightVertices().equalTo(
                    geometryService.factory.polygon([
                        geometryService.factory.point(1, 1),
                        geometryService.factory.point(1, 5),
                        geometryService.factory.point(7, 5),
                        geometryService.factory.point(7, 1),
                    ])
                )
            ).toBeTruthy()
        });
    });

    describe('toString', () => {
        it ('creates a string representation of the `Polygon`', () => {
            const polygon = geometryService.factory.polygon([
                geometryService.factory.point(3, 5),
                geometryService.factory.point(3, 7),
                geometryService.factory.point(6, 7),
                geometryService.factory.point(6, 5)
            ]);

            expect(polygon.toString()).toEqual('[(3,5)(3,7)(6,7)(6,5)]');
        });
    });

    describe('setPosition', () => {
        it ('sets the center of the Polygon to the given position', () => {
            const polygon = Polygon.createRectangle(1, 2, 4, 3);

            expect(
                polygon.setPosition(geometryService.factory.point(3, 3)).equalTo(Polygon.createRectangle(1, 1.5, 4, 3))
            ).toBeTruthy();
        });
    });
});