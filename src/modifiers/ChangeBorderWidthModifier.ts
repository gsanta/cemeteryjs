import { Point, Segment } from '@nightshifts.inc/geometry';
import { RoomUtils } from "../utils/RoomUtils";
import { WorldItemInfo } from "../WorldItemInfo";
import { WorldItemUtils } from "../WorldItemUtils";
import { Modifier } from "./Modifier";
import _ = require("lodash");

/**
 * This transformator can be used to adjust the width of a border item to it's real width.
 * Usually for example for a door the size on the world map is just an estimation, which has to be adjusted to the
 * real width of the actual door mesh. This transformator can be used for that.
 */
export class ChangeBorderWidthModifier implements Modifier {
    private realItemWidths: {name: string, width: number}[] = [];

    constructor(realItemWidths: {name: string, width: number}[] = []) {
        this.realItemWidths = realItemWidths;
    }

    public apply(worldItems: WorldItemInfo[]): WorldItemInfo[] {
        const rooms: WorldItemInfo[] = WorldItemUtils.filterRooms(worldItems);

        /**
         * The border width adjustment has to be done room by room because the adjustment algorithm needs the
         * prev and next border segments which can be provided easier when the borders are in context of a room.
         */
        rooms.forEach(room => RoomUtils.orderBorderItemsAroundRoomClockwise(room));
        rooms.forEach(room => this.adjustBorderWidthsForRoom(room));

        return worldItems;
    }


    private adjustBorderWidthsForRoom(room: WorldItemInfo) {
        room.borderItems.forEach(item => {
            const realItemWidth = _.find(this.realItemWidths, itemWidth => itemWidth.name === item.name);
            if (realItemWidth !== undefined) {
                this.resizeItem(item, room.borderItems, realItemWidth.width);
            }
        });

    }

    private resizeItem(border: WorldItemInfo, orderedItems: WorldItemInfo[], newSize: number) {
        const rightItem = _.last(orderedItems) === border ? orderedItems[0] : orderedItems[orderedItems.indexOf(border) + 1];
        const leftItem = _.first(orderedItems) === border ? _.last(orderedItems) : orderedItems[orderedItems.indexOf(border) - 1];

        let neighbours = leftItem.dimensions.hasPoint(border.dimensions.getPoints()[0]) ? [leftItem, rightItem] : [rightItem, leftItem];

        const leftBorderItem = <Segment> neighbours[0].dimensions;
        const rightBorderItem = <Segment> neighbours[1].dimensions;
        const currentBorderItem = <Segment> border.dimensions;

        let newPoints: [Point, Point];

        const isLeftCornerItem = () => leftBorderItem.getSlope() !== currentBorderItem.getSlope();
        const isRightCornerItem = () => rightBorderItem.getSlope() !== currentBorderItem.getSlope();

        if (isLeftCornerItem()) {
            newPoints = this.moveOnlyRightEndPoint(<[Point, Point]> border.dimensions.getPoints(), newSize, neighbours[1]);
        } else if (isRightCornerItem()) {
            newPoints = this.moveOnlyLeftEndPoint(<[Point, Point]> border.dimensions.getPoints(), newSize, neighbours[0]);
        } else {
            newPoints = this.moveBothEndPointsEqually(<[Point, Point]> border.dimensions.getPoints(), newSize, neighbours[0], neighbours[1]);
        }


        border.dimensions = new Segment(newPoints[0], newPoints[1]);
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