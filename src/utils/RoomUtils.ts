import * as _ from 'lodash';
import { Point, Measurements } from '@nightshifts.inc/geometry';
import { WorldItem } from '../WorldItem';

export class RoomUtils {
    public static orderBorderItemsAroundRoomClockwise(room: WorldItem) {
        const borderItems = [...room.borderItems];

        const startItem = this.getBottomLeftItem(borderItems);
        let rest = _.without(borderItems, startItem);

        const orderedItems = [startItem];
        while (rest.length > 0) {
            const nextItem = this.findNextBorderItem(_.last(orderedItems), rest);

            orderedItems.push(nextItem);
            rest = _.without(rest, nextItem);
        }

        room.borderItems = orderedItems;
    }

    private static findNextBorderItem(currentBorderItem: WorldItem, borderItems: WorldItem[]) {
        const findByCommonPoint = (commonPoint: Point) =>
            _.find(borderItems, item => {
                const point1 = item.dimensions.getPoints()[0];
                const point2 = item.dimensions.getPoints()[1];
                return Measurements.isDistanceSmallerThan(point1, commonPoint)  || Measurements.isDistanceSmallerThan(point2, commonPoint);
            });

        const points = currentBorderItem.dimensions.getPoints();

        for (let i = 0; i < points.length; i++) {
            const nextBorderItem = findByCommonPoint(points[i]);

            if (nextBorderItem) {
                return nextBorderItem;
            }
        }

        throw new Error('Next border item could not be determined.');
    }

    private static getBottomLeftItem(items: WorldItem[]): WorldItem {
        const copy = [...items];

        copy.sort((item1: WorldItem, item2: WorldItem) => {
            const center1 = item1.dimensions.getBoundingCenter();
            const center2 = item2.dimensions.getBoundingCenter();

            return center1.x === center2.x ? center1.y - center2.y : center1.x - center2.x;
        });

        return copy[0];
    }
}