import { WorldItemTransformator } from "./WorldItemTransformator";
import { WorldItemInfo } from "../WorldItemInfo";
import { Point, Segment } from '@nightshifts.inc/geometry';
import _ = require("lodash");


export class BorderItemWidthToRealWidthTransformator implements WorldItemTransformator {
    private realItemWidths: {type: string, width: number}[] = [];

    constructor(realItemWidths: {type: string, width: number}[] = []) {
        this.realItemWidths = realItemWidths;
    }

    public transform(gwmWorldItems: WorldItemInfo[]): WorldItemInfo[] {

    }

    private orderBorderItemsClockwise(room: WorldItemInfo) {
        const borderItems = room.borderItems;

        let [startItem, ...rest] = borderItems;

        const orderedItems = [startItem];
        while (rest.length > 0) {
            const nextItem = this.findNextBorderItem(_.last(orderedItems), rest);

            orderedItems.push(nextItem);
            rest = _.without(rest, nextItem);
        }
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
}