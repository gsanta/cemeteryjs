import { WorldItemInfo } from "../WorldItemInfo";
import { WorldItemTransformator } from './WorldItemTransformator';
import { Polygon, Line, Shape, Point, GeometryUtils } from '@nightshifts.inc/geometry';
import { WorldItemInfoUtils } from '../WorldItemInfoUtils';
import { Segment } from '@nightshifts.inc/geometry/build/shapes/Segment';
import _ = require("lodash");

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

        // rooms.forEach(room => {
        //     room.borderItems.forEach(borderItem => {
        //         if (borderItem.dimensions instanceof Polygon) {
        //             borderItem.dimensions = this.convertBorderItemPolygonToLine(borderItem.dimensions, room.dimensions);
        //         }
        //     });
        //     room.dimensions = this.expandRoomShapeToFillFreedUpSpace(room.dimensions);
        // });

        this.runAlgorithm(rooms);

        return rootWorldItems;
    }

    private convertBorderItemPolygonToLine(borderItemPolygon: Polygon, roomPolygon: Shape): Segment {
        const coincidentLine = borderItemPolygon.getCoincidentLineSegment(roomPolygon);

        const perpendicularSegments = borderItemPolygon.getEdges().filter(edge => edge.getSlope() !== coincidentLine[0].getSlope());

        const point1 = perpendicularSegments[0].getBoundingCenter();
        const point2 = perpendicularSegments[1].getBoundingCenter();

        const segment = new Segment(point1, point2);

        // return segment.shorten(perpendicularSegments.length)
        return null;
    }

    private expandRoomShapeToFillFreedUpSpace(shape: Shape): Shape {
        return (<Polygon>shape).stretch(this.scales.xScale / 2, this.scales.yScale / 2);
    }

    public runAlgorithm(rooms: WorldItemInfo[]) {

        rooms.forEach(room => {
            const borderItems = rooms[0].borderItems;

            const indexedEdges: [Segment, number][] = rooms[0].dimensions.getEdges().map((edge, index) => [edge, index]);
            const arr: [Shape, Segment, number][] = [];
            borderItems.forEach(item => {
                const closest = _.minBy(indexedEdges, indexedEdge => indexedEdge[0].getBoundingCenter().distanceTo(item.dimensions.getBoundingCenter()));

                arr.push([item.dimensions, closest[0], closest[1]]);
            });

            arr.sort((a, b) => a[2] - b[2]);

            const newPolygonPoints: Point[] = [];

            for (let i = 0; i < arr.length; i++) {
                const item1 = arr[i];
                const item2 = i === arr.length - 1 ? arr[0] : arr[i + 1];

                let segments1: [Segment, Segment];
                if (item1[0] instanceof Segment) {
                    segments1 = [item1[0], item1[0]];
                } else {
                    segments1 = <[Segment, Segment]> item1[0].getEdges().filter(segment => segment.getLine().hasEqualSlope(item1[1].getLine()));
                }

                let segments2: [Segment, Segment];
                if (item2[0] instanceof Segment) {
                    segments2 = [item2[0], item2[0]];
                } else {
                    segments2 = <[Segment, Segment]> item2[0].getEdges().filter(segment => segment.getLine().hasEqualSlope(item2[1].getLine()));
                }

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

            const newPolygon = new Polygon(GeometryUtils.orderPointsToStartAtBottomLeft(newPolygonPoints));
            this.alignBorderItems(room.borderItems, room.dimensions, newPolygon);
            room.dimensions = newPolygon;
        })

        // rooms[0].dimensions.getEdges().forEach(edge => {
        //     const coincidentBorderItems = borderItems.filter(item => item.dimensions.getCoincidentLineSegment(edge));
        //     debugger;
        //     // orderedBorderItems.push(...coincidentBorderItems)
        // });
        // debugger;
        // return rooms.forEach((room: WorldItemInfo) => {



        //     let dimensions: Polygon = <Polygon> room.dimensions;
        //     room.dimensions.getIndexedPoints().forEach(([point, index]) => {
        //         const segment = new Segment(dimensions.getPreviousPoint(index), point);

        //         const centerPoint = segment.getBoundingCenter();
        //         const perpendicularBisector = segment.getPerpendicularBisector();
        //         const tmpSegment = perpendicularBisector.getSegmentWithCenterPointAndDistance(centerPoint, 0.5);
        //         const roomCenterPoint = room.dimensions.getBoundingCenter();
        //         let chosenEndPoint: Point = null;
        //         if (tmpSegment[0].distanceTo(roomCenterPoint) > tmpSegment[1].distanceTo(roomCenterPoint)) {
        //             chosenEndPoint = tmpSegment[0];
        //         } else {
        //             chosenEndPoint = tmpSegment[1];
        //         }

        //         const line = Line.createFromPointSlopeForm(chosenEndPoint, segment.getSlope());
        //         const points = line.getSegmentWithCenterPointAndDistance(chosenEndPoint, segment.getLength() / 2 + 0.5);
        //         const newSegment = new Segment(points[0], points[1]);
        //         newSegments.push(newSegment);
        //     });

        //     const segments = room.dimensions.getEdges();
        //     const newSegments: Segment[] = [];

        //     segments.forEach((segment: Segment) => {
        //         const centerPoint = segment.getBoundingCenter();
        //         const perpendicularBisector = segment.getPerpendicularBisector();
        //         const tmpSegment = perpendicularBisector.getSegmentWithCenterPointAndDistance(centerPoint, 0.5);
        //         const roomCenterPoint = room.dimensions.getBoundingCenter();
        //         let chosenEndPoint: Point = null;
        //         if (tmpSegment[0].distanceTo(roomCenterPoint) > tmpSegment[1].distanceTo(roomCenterPoint)) {
        //             chosenEndPoint = tmpSegment[0];
        //         } else {
        //             chosenEndPoint = tmpSegment[1];
        //         }

        //         const line = Line.createFromPointSlopeForm(chosenEndPoint, segment.getSlope());
        //         const points = line.getSegmentWithCenterPointAndDistance(chosenEndPoint, segment.getLength() / 2 + 0.5);
        //         const newSegment = new Segment(points[0], points[1]);
        //         newSegments.push(newSegment);
        //     });

        //     const newPoints: Point[] = [];
        //     newPoints.push(newSegments[0].getPoints()[0]);
        //     newPoints.push(newSegments[0].getPoints()[1]);
        //     _.without(newSegments, newSegments[0], _.last(newSegments)).forEach(segment => {
        //         const distance1 = segment.getPoints()[0].distanceTo(_.last(newPoints));
        //         const distance2 = segment.getPoints()[1].distanceTo(_.last(newPoints));
        //         if (distance1 < distance2) {
        //             newPoints.push(segment.getPoints()[1]);
        //         } else {
        //             newPoints.push(segment.getPoints()[0]);
        //         }
        //     });

        //     const newDimensions = new Polygon(newPoints);
        //     this.alignBorderItems(room.borderItems, room.dimensions, newDimensions);
        //     room.dimensions = new Polygon(newPoints);
        // });
    }

    public alignBorderItems(borderItems: WorldItemInfo[], dimensions: Shape, newDimensions: Polygon) {
        const oldEdges = dimensions.getEdges();
        const newEdges = newDimensions.getEdges();

        newEdges.forEach((edge, index) => {
            const coincidentBorderItems = borderItems.filter(item => item.dimensions.getCoincidentLineSegment(oldEdges[index]));

            const maxLen = coincidentBorderItems
                .map(borderItem => borderItem.dimensions.getCoincidentLineSegment(oldEdges[index])[0])
                .reduce((sum, nextItem) => sum + nextItem.getLength(), 0);

            coincidentBorderItems.sort((item1, item2) => {
                return item1.dimensions.getBoundingCenter().distanceTo(edge.getPoints()[0]) - item2.dimensions.getBoundingCenter().distanceTo(edge.getPoints()[0])
            });

            const referencePoint = edge.getPoints()[0];

            coincidentBorderItems.forEach(item => {
                const len = newEdges[index].getLength();
                const ratio = item.dimensions.getCoincidentLineSegment(oldEdges[index])[0].getLength() / maxLen;
                const line = Line.createFromPointSlopeForm(referencePoint, edge.getSlope());
                const tmpSegment = line.getSegmentWithCenterPointAndDistance(referencePoint, (ratio * len) / 2);

                if (tmpSegment[0].distanceTo(edge.getPoints()[1]) < tmpSegment[1].distanceTo(edge.getPoints()[1])) {
                    const newSegment = line.getSegmentWithCenterPointAndDistance(tmpSegment[0], (ratio * len) / 2);
                    item.dimensions = new Segment(newSegment[0], newSegment[1]);
                } else {
                    const newSegment = line.getSegmentWithCenterPointAndDistance(tmpSegment[1], (ratio * len) / 2);
                    item.dimensions = new Segment(newSegment[0], newSegment[1]);
                }
            });
        });
    }
}

/**
 *
 *
 * for each room do the following
 *    for each side Segment of the actual room do the following
 *        1. stretch the given side Segment of the room
 *
 *        if wall(s) Segment(s) belonging to that room side Segments are not marked as visited (they should be all marked or none of them)
 *            stretch the wall(s) Segment(s) belonging to that room side Segment
 *                (there can be multiple wall Segments that belong to that room side so stretch them in the following way:)
 *            2. make all of the wall(s) Segment(s) bigger by the same ratio the room side Segment was increased
 *            3. reposition the wall(s) Segment(s) starting at one endpoint of the new room side Segment and putting them one after the other
 *
 *        4. connect the left room side Segment to the left endpoint of the stretched room side Segment
 *
 *        if wall(s) Segment(s) belonging to the left room side Segment are not marked as visited (they should be all marked or none of them)
 *           5. get the angle by which the left neighbouring Segment was rotated
 *           6. get the ratio by which the neighbouring Segment's length changed
 *           7. rotate the wall(s) Segment(s) belonging to the left room Segment at the stable endpoint of the room Segment as the pivot point
 *           8. change the wall(s) Segments length by the ratio calculated at 5.
 *           9. reposition the wall(s) Segment(s) starting at one endpoint of the new room side Segment and putting them one after the other
 *           10. go back to step 3. and do the same to the right side of the room Side segment which was stretched
 *
 *
 *  iterate over all of the rooms
 *        iterate over all of the room side Segments
 *            get the corresponding wall Segments to the current room side Segment (use Shape.getCoincidentLineSegment to filter the relevant wall Segments)
 *            get the width on of the wall segments (each should have the same width)
 *            stretch the room side Segment by that width (use Segment.stretch)
 *            stretch the corresponding wall side Segment(s) (use Segment.stretch)
 *                - choose one arbitrary end point of the new room Segment
 *                - sort the wall Segments by asc order based on their distance to this room Segment endPoint (use Point.distanceTo)
 *                - init referencePoint as the room Segment endpoint
 *                - iterate over all of the wall Segments
 *                    - get the closer endPoint of the wall Segment to the reference Point
 *                    - subtract referencePoint from the chosen wall Segment endPoint to get a Vector
 *                    - add the Vector to both pf the endPoints of the wall Segment
 *                    - set the other endPoint of the wall Segment (not the one which was chosen previously) as the referencePoint
 * 4:
 *  -           get the left room side Segment
 *  -           get the Segment's endPoint which is closer to the original (before stretching) room side Segments left endPoint
 *  -           change that endPoint to the stretched left endPoint of the Segment
 *
 * 5.           use Point.angleTo with the original room side Segment left endpoint and the modified left endpoint to get the rotation angle
 * 6.           use the original left room side Segment and the new one to calculate the length change: newLength / origLength
 * 7.           get the wall Segment(s) belonging to the left room side Segment
 *              calculate the wall Segment(s) length ratio to the  left room side segment, order them by their distance to the stable room side Segment endpoint
 *              set the stable endpoint of the left room side Segment as the referencePoint
 *              iterate over the wall Segments
 *                calc radius for the new wall side Segment as the half of the ratio * new left room side Segment length
 *                create a temporary Segment with the referencePoint as center and with the previously calculated radius
 *                from the two endPoints of the temporary Segment choose the one which is closer to the rotated endPoint of the left
 *                room side Segment
 *                create a new wall Segment with the previously chosen point as center point and the radius as radius
 *                again get the endPoint of the new wall Segment which is closer to the rotated left room side Segment
 *                set this point as the next reference point
 *
 *
 * *************************************************************8
 *
 * store wall side width
 * iterate over all of the rooms
 *     iterate over all of the room side Segments
 *         if act room side Segment was not visited
 *             stretch the room side Segment by half wall side width on both directions
 *             move room side Segment to it's normal direction by half wall side width
 *             get wall side Segments which coincide to the original pos of the act room side Segment
 *             get the size ratios of the wall side Segment(s) to the original room side Segment
 *             order wall side Segment(s) by their distance to one of the original endpoints of the room side Segment
 *             set the chosen original endpoint as the referencePoint
 *             iterate over the wall side Segment(s)
 *                 create a temporary Segment with the referencePoint as the centerPoint and the radius as half of the wall Segment size ratio * original room width
 *                 select the endpoint of the temporary Segment that is closer to the other room side Segment (not the chosen one)
 *                 create a Segment with the previously selected endpoint as the center point and the radiues as half of temp Segemnt's length
 *                 set the created Segment's endpoint which is closer to the other room side Segment (not the chosen one) as the reference point
 */