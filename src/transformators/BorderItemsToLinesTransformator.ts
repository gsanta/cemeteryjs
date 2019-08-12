import { WorldItemInfo } from "../WorldItemInfo";
import { WorldItemTransformator } from './WorldItemTransformator';
import { Polygon, Line, Shape, Point, GeometryUtils, StripeView } from '@nightshifts.inc/geometry';
import { WorldItemInfoUtils } from '../WorldItemInfoUtils';
import { Segment } from '@nightshifts.inc/geometry/build/shapes/Segment';
import _ = require("lodash");

export const mergeStraightAngledNeighbouringBorderItemPolygons = (borderItemPolygons: Shape[]): Shape[] => {
    borderItemPolygons = [...borderItemPolygons];
    const mergedPolygons: Shape[] = [borderItemPolygons.shift()];

    while(borderItemPolygons.length > 0) {
        const currentPolygon: Polygon = <Polygon> mergedPolygons.shift();

        const mergeablePolygonIndex = borderItemPolygons
            .findIndex((otherPolygon: Polygon) => {
                const stripe1 = new StripeView(<Polygon> currentPolygon);
                const stripe2 = new StripeView(<Polygon> otherPolygon);

                return stripe1.getSlope() === stripe2.getSlope() && currentPolygon.intersect(otherPolygon);
            });

        let mergedPolygon: Polygon;

        if (mergeablePolygonIndex !== -1) {
            mergedPolygon = new StripeView(<Polygon> currentPolygon).merge(new StripeView(<Polygon> borderItemPolygons[mergeablePolygonIndex]));
        }

        if (mergedPolygon) {
            borderItemPolygons.splice(mergeablePolygonIndex, 1);
            mergedPolygons.unshift(mergedPolygon);
        } else {
            mergedPolygons.unshift(currentPolygon);
            mergedPolygons.unshift(borderItemPolygons.pop())
        }
    }

    return mergedPolygons;
}

/**
 * It can be useful to represent walls, doors etc. as `Segment`s instead of `Polygon`s, so this class transforms the border item
 * `Polygon`s into `Segment`s and also stretches the room `Polygon`s so that they fill up the generated empty space.
 */
export class BorderItemsToLinesTransformator implements WorldItemTransformator {
    private scales: {xScale: number, yScale: number};

    constructor(scales: {xScale: number, yScale: number} = {xScale: 1, yScale: 1}) {
        this.scales = scales;
    }

    public transform(gwmWorldItems: WorldItemInfo[]): WorldItemInfo[] {
        return this.stretchRooms(gwmWorldItems);
    }

    private stretchRooms(rootWorldItems: WorldItemInfo[]) {
        const rooms: WorldItemInfo[] = WorldItemInfoUtils.filterRooms(rootWorldItems);

        this.runAlgorithm(rooms);

        return rootWorldItems;
    }

    public runAlgorithm(rooms: WorldItemInfo[]) {

        const newRoomDimensions = rooms.map(room => {
            const borders = mergeStraightAngledNeighbouringBorderItemPolygons(room.borderItems.map(item => item.dimensions));
            const roomSides = room.dimensions.getEdges();

            const newPolygonPoints: Point[] = [];
            const borderRoomSidePairs = this.pairBordersToRoomSides(borders, roomSides);

            let newPolygon: Polygon;

            try {
                for (let i = 0; i < borderRoomSidePairs.length; i++) {
                    const currentPair = borderRoomSidePairs[i];
                    const nextPair = i === borderRoomSidePairs.length - 1 ? borderRoomSidePairs[0] : borderRoomSidePairs[i + 1];

                    let currParallelLines: [Segment, Segment] = this.getBorderSidesParallelToRoomSide(currentPair.border, currentPair.roomSide);
                    let nextParallelLines: [Segment, Segment] = this.getBorderSidesParallelToRoomSide(nextPair.border, nextPair.roomSide);

                    const variations: [Segment, Segment][] = [
                        [currParallelLines[0], nextParallelLines[0]],
                        [currParallelLines[1], nextParallelLines[0]],
                        [currParallelLines[0], nextParallelLines[1]],
                        [currParallelLines[1], nextParallelLines[1]]
                    ];

                    const segmentPair1 = _.minBy(variations, (val) => val[0].getBoundingCenter().distanceTo(val[1].getBoundingCenter()));
                    const segmentPair2 = _.maxBy(variations, (val) => val[0].getBoundingCenter().distanceTo(val[1].getBoundingCenter()));

                    const point1 = segmentPair1[0].getLine().intersection(segmentPair1[1].getLine());
                    const point2 = segmentPair2[0].getLine().intersection(segmentPair2[1].getLine());

                    newPolygonPoints.push(new Segment(point1, point2).getBoundingCenter());
                }
                newPolygon = new Polygon(GeometryUtils.orderPointsToStartAtBottomLeft(newPolygonPoints));
            } catch (e) {
                newPolygon = <Polygon>room.dimensions;
            }

            return newPolygon;
        });

        rooms.forEach((room, index) => {
            this.alignBorderItems(room.borderItems, room.dimensions, newRoomDimensions[index]);
            room.dimensions = newRoomDimensions[index];
        });
    }

    private pairBordersToRoomSides(borderPolygons: Shape[], roomSides: Segment[]): { border: Shape, roomSide: Segment}[]  {
        const indexedEdges: [Segment, number][] = roomSides.map((edge, index) => [edge, index]);
        const map: { border: Shape, roomSide: Segment, roomEdgeIndex: number}[] = [];

        borderPolygons.forEach(item => {
            const closestIndexedEdge = _.minBy(indexedEdges, indexedEdge => indexedEdge[0].getBoundingCenter().distanceTo(item.getBoundingCenter()));

            map.push({
                border: item,
                roomSide: closestIndexedEdge[0],
                roomEdgeIndex: closestIndexedEdge[1]
            });
        });

        map.sort((a, b) => a.roomEdgeIndex - b.roomEdgeIndex);

        return map;
    }

    private getBorderSidesParallelToRoomSide(border: Shape, roomSide: Segment): [Segment, Segment] {
        if (border instanceof Segment) {
            return [border, border];
        } else {
            return <[Segment, Segment]> border.getEdges().filter(segment => segment.getLine().hasEqualSlope(roomSide.getLine()));
        }
    }

    public alignBorderItems(borderItems: WorldItemInfo[], dimensions: Shape, newDimensions: Polygon) {
        const oldEdges = dimensions.getEdges();
        const newEdges = newDimensions.getEdges();

        newEdges.forEach((edge, index) => {
            const coincidentBorderItems = borderItems
                .filter(item => item.dimensions instanceof Polygon)
                .filter(item => new StripeView(<Polygon> item.dimensions).overlaps(oldEdges[index]));

            const maxLen = coincidentBorderItems
                .map(borderItem => borderItem.dimensions.getCoincidentLineSegment(oldEdges[index])[0])
                .reduce((sum, nextItem) => sum + nextItem.getLength(), 0);

            coincidentBorderItems.sort((item1, item2) => {
                return item1.dimensions.getBoundingCenter().distanceTo(edge.getPoints()[0]) - item2.dimensions.getBoundingCenter().distanceTo(edge.getPoints()[0])
            });

            let referencePoint = edge.getPoints()[0];

            coincidentBorderItems.forEach(item => {
                const len = newEdges[index].getLength();
                const ratio = item.dimensions.getCoincidentLineSegment(oldEdges[index])[0].getLength() / maxLen;
                const line = Line.createFromPointSlopeForm(referencePoint, edge.getSlope());
                const tmpSegment = line.getSegmentWithCenterPointAndDistance(referencePoint, (ratio * len) / 2);

                let newSegment: Segment;
                if (tmpSegment[0].distanceTo(edge.getPoints()[1]) < tmpSegment[1].distanceTo(edge.getPoints()[1])) {
                    const newSegmentPoints = line.getSegmentWithCenterPointAndDistance(tmpSegment[0], (ratio * len) / 2);
                    newSegment = new Segment(newSegmentPoints[0], newSegmentPoints[1]);
                } else {
                    const newSegmentPoints = line.getSegmentWithCenterPointAndDistance(tmpSegment[1], (ratio * len) / 2);
                    newSegment = new Segment(newSegmentPoints[0], newSegmentPoints[1]);
                }

                item.dimensions = newSegment;
                item.rotation = newSegment.getLine().getAngleToXAxis().getAngle();

                if (referencePoint.distanceTo(newSegment.getPoints()[0]) > referencePoint.distanceTo(newSegment.getPoints()[1])) {
                    referencePoint = newSegment.getPoints()[0];
                } else {
                    referencePoint = newSegment.getPoints()[1];
                }
            });
        });
    }
}