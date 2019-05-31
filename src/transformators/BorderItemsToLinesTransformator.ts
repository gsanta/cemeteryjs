import { WorldItemInfo } from "../WorldItemInfo";
import { WorldItemTransformator } from './WorldItemTransformator';
import { Polygon, Line, Shape } from '@nightshifts.inc/geometry';
import { WorldItemInfoUtils } from '../WorldItemInfoUtils';

/**
 * It can be useful to represent walls, doors etc. as `Line`s instead of `Polygon`s, so this class transforms the border item
 * `Polygon`s into `Line`s and also stretches the room `Polygon`s so that they fill up the generated empty space.
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

    private convertBorderItemPolygonToLine(borderItemPolygon: Polygon, roomPolygon: Shape): Line {
        const coincidentLine = borderItemPolygon.getCoincidentLineSegment(roomPolygon);
        const centerLines = borderItemPolygon.getBoundingRectangle().getCenterLines();

        if (centerLines[0].getSlope() === coincidentLine[0].getSlope()) {
            return centerLines[0];
        } else {
            return centerLines[1];
        }
    }

    private expandRoomShapeToFillFreedUpSpace(shape: Shape): Shape {
        return (<Polygon>shape).stretch(this.scales.xScale / 2, this.scales.yScale / 2);
    }
}