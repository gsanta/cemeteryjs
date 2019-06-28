import { WorldItemTransformator } from "./WorldItemTransformator";
import { WorldItemInfo } from "../WorldItemInfo";
import { Point, Segment, Shape, MeasurementUtils } from '@nightshifts.inc/geometry';
import _ = require("lodash");
import { WorldItemInfoUtils } from "../WorldItemInfoUtils";


export class BorderItemWidthToRealWidthTransformator implements WorldItemTransformator {
    private realItemWidths: {name: string, width: number}[] = [];

    constructor(realItemWidths: {name: string, width: number}[] = []) {
        this.realItemWidths = realItemWidths;
    }

    public transform(worldItems: WorldItemInfo[]): WorldItemInfo[] {
        const rooms: WorldItemInfo[] = WorldItemInfoUtils.filterRooms(worldItems);

        rooms.forEach(room => this.orderBorderItemsAroundRoomClockwise(room));
        rooms.forEach(room => this.resizeBorderItems(room));

        return worldItems;
    }

    private orderBorderItemsAroundRoomClockwise(room: WorldItemInfo) {
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

    private resizeBorderItems(room: WorldItemInfo) {
        room.borderItems.forEach(item => {
            const realItemWidth = _.find(this.realItemWidths, itemWidth => itemWidth.name === item.name);
            if (realItemWidth !== undefined) {
                this.resizeItem(item, room.borderItems, realItemWidth.width);
            }
        });

    }

    private getBottomLeftItem(items: WorldItemInfo[]): WorldItemInfo {
        const copy = [...items];

        copy.sort((item1: WorldItemInfo, item2: WorldItemInfo) => {
            const center1 = item1.dimensions.getBoundingCenter();
            const center2 = item2.dimensions.getBoundingCenter();

            return center1.x === center2.x ? center1.y - center2.y : center1.x - center2.x;
        });

        return copy[0];
    }

    private findNextBorderItem(currentBorderItem: WorldItemInfo, borderItems: WorldItemInfo[]) {
        const findByCommonPoint = (commonPoint: Point) =>
            _.find(borderItems, item => {
                const point1 = item.dimensions.getPoints()[0];
                const point2 = item.dimensions.getPoints()[1];
                return MeasurementUtils.isDistanceSmallerThan(point1, commonPoint)  || MeasurementUtils.isDistanceSmallerThan(point2, commonPoint);
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

    private resizeItem(item: WorldItemInfo, orderedItems: WorldItemInfo[], newSize: number) {
        const nextItem = _.last(orderedItems) === item ? orderedItems[0] : orderedItems[orderedItems.indexOf(item) + 1];
        const prevItem = _.first(orderedItems) === item ? _.last(orderedItems) : orderedItems[orderedItems.indexOf(item) - 1];

        let neighbours = prevItem.dimensions.hasPoint(item.dimensions.getPoints()[0]) ? [prevItem, nextItem] : [nextItem, prevItem];

        const centerPoint = item.dimensions.getBoundingCenter();
        let newSegmentPoints = (<Segment> item.dimensions).getLine().getSegmentWithCenterPointAndDistance(centerPoint, newSize / 2);

        if (newSegmentPoints[0].distanceTo(item.dimensions.getPoints()[0]) > newSegmentPoints[1].distanceTo(item.dimensions.getPoints()[0])) {
            newSegmentPoints = [newSegmentPoints[1], newSegmentPoints[0]];
        }

        this.connectNeighbourSegmentToNewEndpoint(item.dimensions.getPoints()[0], newSegmentPoints[0], neighbours[0]);
        this.connectNeighbourSegmentToNewEndpoint(item.dimensions.getPoints()[1], newSegmentPoints[1], neighbours[1]);
        item.dimensions = new Segment(newSegmentPoints[0], newSegmentPoints[1]);
    }

    private connectNeighbourSegmentToNewEndpoint(oldPoint: Point, newPoint: Point, neighbour: WorldItemInfo) {
        if (neighbour.dimensions.getPoints()[0].equalTo(oldPoint)) {
            neighbour.dimensions = new Segment(newPoint, neighbour.dimensions.getPoints()[1]);
        } else {
            neighbour.dimensions = new Segment(neighbour.dimensions.getPoints()[0], newPoint);
        }
    }
}