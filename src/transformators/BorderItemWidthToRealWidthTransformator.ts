import { Point, Polygon, Segment, StripeView } from '@nightshifts.inc/geometry';
import { RoomUtils } from "../utils/RoomUtils";
import { WorldItemInfo } from "../WorldItemInfo";
import { WorldItemInfoUtils } from "../WorldItemInfoUtils";
import { WorldItemTransformator } from "./WorldItemTransformator";
import _ = require("lodash");

export class BorderItemWidthToRealWidthTransformator implements WorldItemTransformator {
    private realItemWidths: {name: string, width: number}[] = [];

    constructor(realItemWidths: {name: string, width: number}[] = []) {
        this.realItemWidths = realItemWidths;
    }

    public transform(worldItems: WorldItemInfo[]): WorldItemInfo[] {
        const rooms: WorldItemInfo[] = WorldItemInfoUtils.filterRooms(worldItems);

        rooms.forEach(room => RoomUtils.orderBorderItemsAroundRoomClockwise(room));
        rooms.forEach(room => this.resizeBorderItems(room));

        return worldItems;
    }


    private resizeBorderItems(room: WorldItemInfo) {
        room.borderItems.forEach(item => {
            const realItemWidth = _.find(this.realItemWidths, itemWidth => itemWidth.name === item.name);
            if (realItemWidth !== undefined) {
                this.resizeItem(item, room.borderItems, realItemWidth.width);
            }
        });

    }

    private resizeItem(item: WorldItemInfo, orderedItems: WorldItemInfo[], newSize: number) {
        const nextItem = _.last(orderedItems) === item ? orderedItems[0] : orderedItems[orderedItems.indexOf(item) + 1];
        const prevItem = _.first(orderedItems) === item ? _.last(orderedItems) : orderedItems[orderedItems.indexOf(item) - 1];

        let neighbours = prevItem.dimensions.hasPoint(item.dimensions.getPoints()[0]) ? [prevItem, nextItem] : [nextItem, prevItem];

        const prevBorderStripe = new StripeView(<Polygon> neighbours[0].dimensions);
        const nextBorderStripe = new StripeView(<Polygon> neighbours[1].dimensions);
        const currentBorderStripe = new StripeView(<Polygon> item.dimensions);

        let newPoints: [Point, Point];

        if (prevBorderStripe.getCapEdges()[0].getSlope() !== currentBorderStripe.getCapEdges()[0].getSlope()) {
            newPoints = this.moveOnlyRightEndPoint(<[Point, Point]> item.dimensions.getPoints(), newSize, neighbours[1]);
        } else if (nextBorderStripe.getCapEdges()[0].getSlope() !== currentBorderStripe.getCapEdges()[0].getSlope()) {
            newPoints = this.moveOnlyLeftEndPoint(<[Point, Point]> item.dimensions.getPoints(), newSize, neighbours[0]);
        } else {
            newPoints = this.moveBothEndPointsEqually(<[Point, Point]> item.dimensions.getPoints(), newSize, neighbours[0], neighbours[1]);
        }


        item.dimensions = new Segment(newPoints[0], newPoints[1]);
    }

    private moveOnlyRightEndPoint(oldPoints: [Point, Point], newWidth: number, rightNeighbour: WorldItemInfo): [Point, Point] {
        const newPoints: [Point, Point] = oldPoints;
        const line = new Segment(oldPoints[0], oldPoints[1]).getLine();

        const tmpSegmentPoints = line.getSegmentWithCenterPointAndDistance(newPoints[0], newWidth);

        if (tmpSegmentPoints[0].distanceTo(newPoints[1]) < tmpSegmentPoints[1].distanceTo(newPoints[1])) {
            newPoints[1] = tmpSegmentPoints[0];
        } else {
            newPoints[1] = tmpSegmentPoints[1];
        }

        this.connectModifiedBordersToNeighbour(oldPoints[1], newPoints[1], rightNeighbour);

        return newPoints;
    }

    private moveOnlyLeftEndPoint(oldPoints: [Point, Point], newWidth: number, leftNeighbour: WorldItemInfo): [Point, Point] {
        const newPoints: [Point, Point] = oldPoints;
        const line = new Segment(oldPoints[0], oldPoints[1]).getLine();

        const tmpSegmentPoints = line.getSegmentWithCenterPointAndDistance(newPoints[1], newWidth);

        if (tmpSegmentPoints[0].distanceTo(newPoints[0]) < tmpSegmentPoints[1].distanceTo(newPoints[0])) {
            newPoints[0] = tmpSegmentPoints[0];
        } else {
            newPoints[0] = tmpSegmentPoints[1];
        }

        this.connectModifiedBordersToNeighbour(oldPoints[0], newPoints[0], leftNeighbour);

        return newPoints;
    }

    private moveBothEndPointsEqually(oldPoints: [Point, Point], newWidth: number, leftNeighbour: WorldItemInfo, rightNeighbour: WorldItemInfo): [Point, Point] {
        const tmpSegment = new Segment(oldPoints[0], oldPoints[1]);
        const centerPoint = tmpSegment.getBoundingCenter();

        let newPoints = tmpSegment.getLine().getSegmentWithCenterPointAndDistance(centerPoint, newWidth / 2);

        if (newPoints[0].distanceTo(oldPoints[0]) > newPoints[1].distanceTo(oldPoints[0])) {
            newPoints = [newPoints[1], newPoints[0]];
        }

        this.connectModifiedBordersToNeighbour(oldPoints[0], newPoints[0], leftNeighbour);
        this.connectModifiedBordersToNeighbour(oldPoints[1], newPoints[1], rightNeighbour);

        return newPoints;
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