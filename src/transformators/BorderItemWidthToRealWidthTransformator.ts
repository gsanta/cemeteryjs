import { WorldItemTransformator } from "./WorldItemTransformator";
import { WorldItemInfo } from "../WorldItemInfo";
import { Point, Segment, Shape } from '@nightshifts.inc/geometry';
import _ = require("lodash");
import { WorldItemInfoUtils } from "../WorldItemInfoUtils";


export class BorderItemWidthToRealWidthTransformator implements WorldItemTransformator {
    private realItemWidths: {type: string, width: number}[] = [];

    constructor(realItemWidths: {type: string, width: number}[] = []) {
        this.realItemWidths = realItemWidths;
    }

    public transform(worldItems: WorldItemInfo[]): WorldItemInfo[] {
        const rooms: WorldItemInfo[] = WorldItemInfoUtils.filterRooms(worldItems);

        rooms.forEach(room => room.borderItems = this.orderJoiningSegmentsClockwise(room));

        return worldItems[0].borderItems;
    }

    private orderJoiningSegmentsClockwise(room: WorldItemInfo) {
        const borderItems = [...room.borderItems];

        borderItems.sort((item1: WorldItemInfo, item2: WorldItemInfo) => {
            const center1 = item1.dimensions.getBoundingCenter();
            const center2 = item2.dimensions.getBoundingCenter();

            if (center1.x === center2.x) {
                return center1.y - center2.y;
            }

            return center1.x - center2.x;
        });

        const startItem = borderItems[0];
        let rest = _.without(borderItems, startItem);

        const orderedItems = [startItem];
        while (rest.length > 0) {
            const nextItem = this.findNextBorderItem(_.last(orderedItems), rest);

            orderedItems.push(nextItem);
            rest = _.without(rest, nextItem);
        }

        return orderedItems;
    }

    private findNextBorderItem(currentBorderItem: WorldItemInfo, borderItems: WorldItemInfo[]) {
        const findByCommonPoint = (commonPoint: Point) =>
            _.find(borderItems, item => item.dimensions.getPoints()[0].equalTo(commonPoint) || item.dimensions.getPoints()[1].equalTo(commonPoint));

        const points = currentBorderItem.dimensions.getPoints();

        for (let i = 0; i < points.length; i++) {
            const nextBorderItem = findByCommonPoint(points[i]);

            if (nextBorderItem) {
                return nextBorderItem;
            }
        }

        throw new Error('Next border item could not be determined.');
    }

    private resizeItem(item: WorldItemInfo, orderedItems: WorldItemInfo[], newSize: number) {
        const nextItem = _.last(orderedItems) === item ? orderedItems[0] : orderedItems[orderedItems.indexOf(item) + 1];
        const prevItem = _.first(orderedItems) === item ? _.last(orderedItems) : orderedItems[orderedItems.indexOf(item) - 1];

        const centerPoint = item.dimensions.getBoundingCenter();
        const newSegment = (<Segment> item.dimensions).getLine().getSegmentWithCenterPointAndDistance(centerPoint, newSize / 2);
    }
}