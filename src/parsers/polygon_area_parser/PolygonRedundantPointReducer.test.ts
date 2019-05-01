import { PolygonRedundantPointReducer } from './PolygonRedundantPointReducer';
import { expect } from 'chai';
import { Point } from '@nightshifts.inc/geometry';

describe('PolygonRedundantPointReducer', () => {
    describe('reduce', () => {
        it ('removes redundant points from a polygon', () => {
            const points = [
                new Point(1, 1),
                new Point(3, 1),
                new Point(3, 2),
                new Point(3, 3),
                new Point(1, 3)
            ]

            const polygonRedundantPointReducer = new PolygonRedundantPointReducer();
            const reducedPoints = polygonRedundantPointReducer.reduce(points);

            expect(reducedPoints).to.eql([
                new Point(1, 1),
                new Point(3, 1),
                new Point(3, 3),
                new Point(1, 3)
            ]);
        });
    });
});