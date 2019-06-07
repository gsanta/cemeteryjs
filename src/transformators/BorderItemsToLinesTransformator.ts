import { WorldItemInfo } from "../WorldItemInfo";
import { WorldItemTransformator } from './WorldItemTransformator';
import { Polygon, Line, Shape } from '@nightshifts.inc/geometry';
import { WorldItemInfoUtils } from '../WorldItemInfoUtils';
import { Segment } from '@nightshifts.inc/geometry/build/shapes/Segment';

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

        rooms.forEach(room => {
            room.borderItems.forEach(borderItem => {
                if (borderItem.dimensions instanceof Polygon) {
                    borderItem.dimensions = this.convertBorderItemPolygonToLine(borderItem.dimensions, room.dimensions);
                }
            });
            room.dimensions = this.expandRoomShapeToFillFreedUpSpace(room.dimensions);
        });

        return rootWorldItems;
    }

    private convertBorderItemPolygonToLine(borderItemPolygon: Polygon, roomPolygon: Shape): Segment {
        const coincidentLine = borderItemPolygon.getCoincidentLineSegment(roomPolygon);

        const perpendicularSegments = borderItemPolygon.getEdges().filter(edge => edge.getSlope() !== coincidentLine[0].getSlope());

        const point1 = perpendicularSegments[0].getBoundingCenter();
        const point2 = perpendicularSegments[1].getBoundingCenter();

        const segment = new Segment(point1, point2);

        return segment.shorten(perpendicularSegments.length)
    }

    private expandRoomShapeToFillFreedUpSpace(shape: Shape): Shape {
        return (<Polygon>shape).stretch(this.scales.xScale / 2, this.scales.yScale / 2);
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
 * 1: Segment.stretch by wall Segments width
 * 2: Segment.stretch for all Segments
 * 3:
 *      - choose one arbitrary end point of the new room Segment
 *      - sort the wall Segments by asc order based on their distance to this room Segment endPoint (use Point.distanceTo)
 *      - init referencePoint as the room Segment endpoint
 *      - iterate over all of the wall Segments
 *          - get the closer endPoint of the wall Segment to the reference Point
 *          - subtract referencePoint from the chosen wall Segment endPoint to get a Vector
 *          - add the Vector to both pf the endPoints of the wall Segment
 *          - set the other endPoint of the wall Segment (not the one which was chosen previously) as the referencePoint
 * 4:
 *  - get the left room side Segment
 *  - get the Segment's endPoint which is closer to the original (before stretching) wall Segments left endPoint
 *  - change that endPoint to the stretched left endPoint of the Segment
 *  - calculate the rotation angle between the original end the modified Segment
 *
 * 3: - use Point.distanceTo to get the distance for all wall Segments to one of the new endpoints of the room side Segment
 *    - use Line.getSegmentWithCenterPointAndDistance
 *
 */