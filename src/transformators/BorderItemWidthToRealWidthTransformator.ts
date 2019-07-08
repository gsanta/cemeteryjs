import { WorldItemTransformator } from "./WorldItemTransformator";
import { WorldItemInfo } from "../WorldItemInfo";
import { Point, Segment, Shape, MeasurementUtils, StripeView, Polygon, Line } from '@nightshifts.inc/geometry';
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

    private resizeItem(item: WorldItemInfo, orderedItems: WorldItemInfo[], newSize: number) {
        const nextItem = _.last(orderedItems) === item ? orderedItems[0] : orderedItems[orderedItems.indexOf(item) + 1];
        const prevItem = _.first(orderedItems) === item ? _.last(orderedItems) : orderedItems[orderedItems.indexOf(item) - 1];

        let neighbours = prevItem.dimensions.hasPoint(item.dimensions.getPoints()[0]) ? [prevItem, nextItem] : [nextItem, prevItem];

        const centerPoint = item.dimensions.getBoundingCenter();
        let newSegmentPoints = (<Segment> item.dimensions).getLine().getSegmentWithCenterPointAndDistance(centerPoint, newSize / 2);

        if (newSegmentPoints[0].distanceTo(item.dimensions.getPoints()[0]) > newSegmentPoints[1].distanceTo(item.dimensions.getPoints()[0])) {
            newSegmentPoints = [newSegmentPoints[1], newSegmentPoints[0]];
        }

        const prevBorderStripe = new StripeView(<Polygon> neighbours[0].dimensions);
        const nextBorderStripe = new StripeView(<Polygon> neighbours[1].dimensions);
        const currentBorderStripe = new StripeView(<Polygon> item.dimensions);

        if (prevBorderStripe.getCapEdges()[0].getSlope() !== currentBorderStripe.getCapEdges()[0].getSlope()) {
            this.snapModifiedBorderToPrevBorder(<[Point, Point]> item.dimensions.getPoints(), newSegmentPoints, neighbours[1]);
        } else if (nextBorderStripe.getCapEdges()[0].getSlope() !== currentBorderStripe.getCapEdges()[0].getSlope()) {
            this.snapModifiedBorderToNextBorder(<[Point, Point]> item.dimensions.getPoints(), newSegmentPoints, neighbours[0]);
        } else {
            this.connectModifiedBordersToNeighbour(item.dimensions.getPoints()[0], newSegmentPoints[0], neighbours[0]);
            this.connectModifiedBordersToNeighbour(item.dimensions.getPoints()[1], newSegmentPoints[1], neighbours[1]);
        }


        item.dimensions = new Segment(newSegmentPoints[0], newSegmentPoints[1]);
    }

    private snapModifiedBorderToPrevBorder(oldPoints: [Point, Point], newPoints: [Point, Point], nextNeighbour: WorldItemInfo) {
        const width = newPoints[0].distanceTo(newPoints[1]);
        newPoints[0] = oldPoints[0];
        const line = new Segment(oldPoints[0], oldPoints[1]).getLine();

        const tmpSegmentPoints = line.getSegmentWithCenterPointAndDistance(newPoints[0], width);

        if (tmpSegmentPoints[0].distanceTo(newPoints[1]) < tmpSegmentPoints[1].distanceTo(newPoints[1])) {
            newPoints[1] = tmpSegmentPoints[0];
        } else {
            newPoints[1] = tmpSegmentPoints[1];
        }

        this.connectModifiedBordersToNeighbour(oldPoints[1], newPoints[1], nextNeighbour);
    }

    private snapModifiedBorderToNextBorder(oldPoints: [Point, Point], newPoints: [Point, Point], prevNeighbour: WorldItemInfo) {
        const width = newPoints[0].distanceTo(newPoints[1]);
        newPoints[1] = oldPoints[1];
        const line = new Segment(oldPoints[0], oldPoints[1]).getLine();

        const tmpSegmentPoints = line.getSegmentWithCenterPointAndDistance(newPoints[1], width);

        if (tmpSegmentPoints[0].distanceTo(newPoints[0]) < tmpSegmentPoints[1].distanceTo(newPoints[0])) {
            newPoints[0] = tmpSegmentPoints[0];
        } else {
            newPoints[0] = tmpSegmentPoints[1];
        }

        this.connectModifiedBordersToNeighbour(oldPoints[0], newPoints[0], prevNeighbour);
    }

    private connectModifiedBordersToNeighbour(oldPoint: Point, newPoint: Point, neighbour: WorldItemInfo) {
        const neighbourPoints = neighbour.dimensions.getPoints();

        if (neighbourPoints[0].distanceTo(oldPoint) < neighbourPoints[1].distanceTo(oldPoint)) {
            neighbour.dimensions = new Segment(newPoint, neighbour.dimensions.getPoints()[1]);
        } else {
            neighbour.dimensions = new Segment(neighbour.dimensions.getPoints()[0], newPoint);
        }
    }
}