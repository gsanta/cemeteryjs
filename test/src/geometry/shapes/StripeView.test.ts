import { StripeView } from "../../../../src/misc/geometry/shapes/StripeView";
import { Point } from "../../../../src/misc/geometry/shapes/Point";
import { Polygon } from "../../../../src/misc/geometry/shapes/Polygon";
import { Segment } from "../../../../src/misc/geometry/shapes/Segment";

describe(`StripeView`, () => {
    describe(`getSlope`, () => {
        it ('returns with the slope of the longer side of the stripe', () => {
            const stripeHorizontal = new StripeView(Polygon.createRectangle(1, 1, 5, 1), 0);

            expect(stripeHorizontal.getSlope()).toEqual(0);

            const stripeVertical = new StripeView(Polygon.createRectangle(1, 1, 1, 5), Math.PI / 2);

            expect(stripeVertical.getSlope()).toEqual(undefined);

            const stripe45DegreesRotated = new StripeView(new Polygon([
                new Point(0, 1),
                new Point(4, 5),
                new Point(5, 4),
                new Point(1, 0)
            ]), Math.PI / 4);

            expect(stripe45DegreesRotated.getSlope()).toEqual(1);
        });
    });

    describe(`merge`, () => {
        it ('merges two overlapping (horizontal) stripes', () => {
            const stripe1 = new StripeView(Polygon.createRectangle(0, 0, 4, 1), 0);
            const stripe2 = new StripeView(Polygon.createRectangle(2, 0, 6, 1), 0);
            expect(
                stripe1.merge(stripe2).equalTo(Polygon.createRectangle(0, 0, 8, 1))
            ).toBeTruthy();

        });

        it ('merges two overlapping (vertical) stripes', () => {
            const stripe1 = new StripeView(Polygon.createRectangle(0, 0, 1, 4), Math.PI / 2);
            const stripe2 = new StripeView(Polygon.createRectangle(0, 2, 1, 6), Math.PI / 2);
            expect(stripe1.merge(stripe2).equalTo(Polygon.createRectangle(0, 0, 1, 8))).toBeTruthy();
        });
    });

    describe(`overlaps`, () => {
        it ('returns with overlap info if there is an overlap on one of the long sides', () => {
            const rect = Polygon.createRectangle(0, 0, 5, 1);
            const stripe = new StripeView(rect, 0);

            const fullOverlap = stripe.overlaps(new Segment(new Point(2, 1), new Point(4, 1)));
            expect(fullOverlap).toEqual([new Segment(new Point(2, 1), new Point(4, 1)), 1]);

            const partialOverlap = stripe.overlaps(new Segment(new Point(-1, 1), new Point(2, 1)));
            expect(partialOverlap).toEqual([new Segment(new Point(0, 1), new Point(2, 1)), 1]);
        });

        it ('returns with overlap info if there is an overlap on the other long side', () => {
            const rect = Polygon.createRectangle(0, 0, 5, 1);
            const stripe = new StripeView(rect, 0);

            const fullOverlap = stripe.overlaps(new Segment(new Point(2, 0), new Point(4, 0)));
            expect(fullOverlap).toEqual([new Segment(new Point(2, 0), new Point(4, 0)), 3]);
        });

        it ('returns undefined if there is no overlap', () => {
            const rect = Polygon.createRectangle(0, 0, 5, 1);
            const stripe = new StripeView(rect, 0);

            const fullOverlap = stripe.overlaps(new Segment(new Point(-2, 0), new Point(-1, 0)));
            expect(fullOverlap).toEqual(undefined);
        });
    });
});
