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

export const mergePolygonsIfHaveCommonEdges = (polygon1: Polygon, polygon2: Polygon): Polygon | undefined => {
    const stripe1 = new StripeView(polygon1);
    const stripe2 = new StripeView(polygon2);
    const edges1 = polygon1.getEdges();
    const edges2 = polygon2.getEdges();

    let commonEdge: Segment;
    for (let i = 0; i < edges1.length; i++) {
        for (let j = 0; j < edges2.length; j++) {
            if (this.isCommonEdge(edges1[i], edges2[j])) {
                commonEdge = edges1[i];
                break;
            }
        }
    }

    if (commonEdge) {
        const orderedPoints1 = this.orderPolygonPointSoThatTheArrayStartsAndEndsWithEdge(polygon1, commonEdge);
        const orderedPoints2 = this.orderPolygonPointSoThatTheArrayStartsAndEndsWithEdge(polygon2, commonEdge);

        orderedPoints2.pop();

        if (polygon1.getIndexOf(orderedPoints1[0]) === 0) {
            orderedPoints2.push(...orderedPoints1);
        } else {
            orderedPoints2.unshift(...orderedPoints1);
        }

        return new Polygon(orderedPoints2).removeStraightVertices();
    }

    return undefined;
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
            let borderItemPolygons = room.borderItems.map(item => item.dimensions);
            borderItemPolygons = mergeStraightAngledNeighbouringBorderItemPolygons(borderItemPolygons);
            const roomEdges = room. dimensions.getEdges();

            const newPolygonPoints: Point[] = [];
            const map = this.mapBorderItemToCorrespondingRoomEdge(borderItemPolygons, roomEdges);

            let newPolygon: Polygon;

            try {
                for (let i = 0; i < map.length; i++) {
                    const item1 = map[i];
                    const item2 = i === map.length - 1 ? map[0] : map[i + 1];

                    let segments1: [Segment, Segment] = this.getBorderItemPolygonEdgesParallelToCorrespondingRoomEdge(item1);
                    let segments2: [Segment, Segment] = this.getBorderItemPolygonEdgesParallelToCorrespondingRoomEdge(item2);

                    const variations: [Segment, Segment][] = [
                        [segments1[0], segments2[0]],
                        [segments1[1], segments2[0]],
                        [segments1[0], segments2[1]],
                        [segments1[1], segments2[1]]
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

            // this.alignBorderItems(room.borderItems, room.dimensions, newPolygon);
            return newPolygon;
        });

        rooms.forEach((room, index) => {
            this.alignBorderItems(room.borderItems, room.dimensions, newRoomDimensions[index]);
            room.dimensions = newRoomDimensions[index];
        });
    }

    private mergeStraightAngledNeighbouringBorderItemPolygons(borderItemPolygons: Shape[]): Shape[] {
        borderItemPolygons = [...borderItemPolygons];
        const mergedPolygons: Shape[] = [borderItemPolygons.shift()];

        while(borderItemPolygons.length > 0) {
            const currentPolygon = mergedPolygons.shift();

            const mergeablePolygonIndex = borderItemPolygons
                .findIndex(otherPolygon => GeometryUtils.mergePolygonsIfHaveCommonEdges(<Polygon>currentPolygon, <Polygon>otherPolygon));

            let mergedPolygon: Polygon;

            if (mergeablePolygonIndex !== -1) {
                mergedPolygon = GeometryUtils.mergePolygonsIfHaveCommonEdges(<Polygon>currentPolygon, <Polygon>borderItemPolygons[mergeablePolygonIndex]);
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

    private mapBorderItemToCorrespondingRoomEdge(borderItemPolygons: Shape[], roomEdges: Segment[]): { borderItem: Shape, roomEdge: Segment}[]  {
        const indexedEdges: [Segment, number][] = roomEdges.map((edge, index) => [edge, index]);
        const map: { borderItem: Shape, roomEdge: Segment, roomEdgeIndex: number}[] = [];

        borderItemPolygons.forEach(item => {
            const closestIndexedEdge = _.minBy(indexedEdges, indexedEdge => indexedEdge[0].getBoundingCenter().distanceTo(item.getBoundingCenter()));

            map.push({
                borderItem: item,
                roomEdge: closestIndexedEdge[0],
                roomEdgeIndex: closestIndexedEdge[1]
            });
        });

        map.sort((a, b) => a.roomEdgeIndex - b.roomEdgeIndex);

        return map;
    }

    private getBorderItemPolygonEdgesParallelToCorrespondingRoomEdge(borderItemRoomEdgePair: { borderItem: Shape, roomEdge: Segment}): [Segment, Segment] {
        const {borderItem, roomEdge} = {...borderItemRoomEdgePair};
        if (borderItem instanceof Segment) {
            return [borderItem, borderItem];
        } else {
            return <[Segment, Segment]> borderItem.getEdges().filter(segment => segment.getLine().hasEqualSlope(roomEdge.getLine()));
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

                if (referencePoint.distanceTo(newSegment.getPoints()[0]) > referencePoint.distanceTo(newSegment.getPoints()[1])) {
                    referencePoint = newSegment.getPoints()[0];
                } else {
                    referencePoint = newSegment.getPoints()[1];
                }
            });
        });
    }
}