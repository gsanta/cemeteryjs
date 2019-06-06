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