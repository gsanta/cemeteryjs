import { Measurements } from '../geometry/utils/Measurements';
import { Point } from '../geometry/shapes/Point';
import { GameObject } from '../../world_generator/services/GameObject';
import { without, last } from '../../world_generator/utils/Functions';

export class RoomUtils {
    public static orderBorderItemsAroundRoomClockwise(room: GameObject) {
        const borderItems = [...room.borderItems];

        const startItem = this.getBottomLeftItem(borderItems);

        if (startItem) {
            let rest = without(borderItems, startItem);
    
            const orderedItems = [startItem];
            while (rest.length > 0) {
                const nextItem = this.findNextBorderItem(last(orderedItems), rest);
    
                orderedItems.push(nextItem);
                rest = without(rest, nextItem);
            }

            room.borderItems = orderedItems;
        }
    }

    private static findNextBorderItem(currentBorderItem: GameObject, borderItems: GameObject[]) {
        const findByCommonPoint = (commonPoint: Point) =>
            borderItems.find(item => {
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

    private static getBottomLeftItem(items: GameObject[]): GameObject {
        const copy = [...items];

        copy.sort((item1: GameObject, item2: GameObject) => {
            const center1 = item1.dimensions.getBoundingCenter();
            const center2 = item2.dimensions.getBoundingCenter();

            return center1.x === center2.x ? center1.y - center2.y : center1.x - center2.x;
        });

        return copy.length ? copy[0] : null;
    }
}