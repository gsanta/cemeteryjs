import { Polygon } from '../../model/Polygon';
import { Point } from '../../model/Point';
import _ = require('lodash');

const getPrevIndex = (currentIndex: number, maxIndex: number) => currentIndex === maxIndex ? 0 : currentIndex + 1;
const getNextIndex = (currentIndex: number, maxIndex: number) => currentIndex === 0 ? maxIndex : currentIndex - 1;

export class PolygonRedundantPointReducer {

    public reduce(points: Point[]): Point[] {
        if (points.length < 3) {
            return points;
        }

        const getNormalizedIndex = (index: number, maxIndex: number) => index > maxIndex ? index - (maxIndex + 1) : index;

        const max = points.length - 1;
        const startPoint = this.findACornerPoint(points);
        let startIndex = points.indexOf(startPoint);

        const reducedPoints = [startPoint];

        _.range(1, points.length).forEach(index => {
            const normalizedIndex = getNormalizedIndex(index + startIndex, max);
            const prevIndex = getPrevIndex(normalizedIndex, max);
            const nextIndex = getNextIndex(normalizedIndex, max);

            if (points[prevIndex].isDiagonalTo(points[nextIndex])) {
                reducedPoints.push(points[normalizedIndex]);
            }
        });

        return reducedPoints;
    }

    private findACornerPoint(points: Point[]): Point {

        const max = points.length - 1;
        for (let currentIndex = 0; currentIndex <= max; currentIndex++) {
            const prevPoint = points[getPrevIndex(currentIndex, max)];
            const nextPoint = points[getNextIndex(currentIndex, max)]

            if (prevPoint.isDiagonalTo(nextPoint)) {
                return points[currentIndex];
            }
        }

        return points[0];
    }
}