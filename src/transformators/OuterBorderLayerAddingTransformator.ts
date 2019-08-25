import { WorldItemTransformator } from "./WorldItemTransformator";
import { WorldItemInfoUtils } from "../WorldItemInfoUtils";
import { WorldItemInfo } from "../WorldItemInfo";
import { Segment, Polygon, Line, Point } from '@nightshifts.inc/geometry';
import { WorldItemInfoFactory } from '../WorldItemInfoFactory';

/**
 * For external walls (walls where on of the side is not inside of the building) it creates a duplicate `WorldItemInfo` which forms an outer layer.
 * The use of this transformator is highly specialized (used only in the game 'nightshifts-inc' to apply different lights for the outer layer and the other walls), maybe it
 * should be removed in the future when custom transformators can be applied by the user.
 */
export class OuterBorderLayerAddingTransformator implements WorldItemTransformator {
    private worldItemFactory: WorldItemInfoFactory;

    constructor(worldItemFactory: WorldItemInfoFactory = new WorldItemInfoFactory()) {
        this.worldItemFactory = worldItemFactory;
    }

    public transform(rootItems: WorldItemInfo[]): WorldItemInfo[] {
        const rooms = rootItems[0].children.filter(child => child.name === 'room');
        rootItems[0].children
            .filter(child => child.name === 'wall')
            .forEach(wall => this.addLayerIfOuterWall(wall, rooms));
        return rootItems;
    }

    private addLayerIfOuterWall(wall: WorldItemInfo, rooms: WorldItemInfo[]) {
        const segment = <Segment> wall.dimensions;

        const perpendicularLine = segment.getPerpendicularBisector();
        const [testPoint1, testPoint2] = perpendicularLine.getSegmentWithCenterPointAndDistance(segment.getBoundingCenter(), wall.thickness / 2);

        if (rooms.find(room => (<Polygon> room.dimensions).containsPoint(testPoint1)) === undefined) {
            wall.parent.children.push(this.createOuterLayouer(wall, testPoint1));
        } else if (rooms.find(room => (<Polygon> room.dimensions).containsPoint(testPoint2)) === undefined) {
            wall.parent.children.push(this.createOuterLayouer(wall, testPoint2));
        }
    }

    private createOuterLayouer(wall: WorldItemInfo, outerPoint: Point): WorldItemInfo {
        const segment = <Segment> wall.dimensions;

        const clone = this.worldItemFactory.clone(wall);
        const [p1, p2] = Line.fromPointSlopeForm(outerPoint, segment.getSlope()).getSegmentWithCenterPointAndDistance(outerPoint, segment.getLength() / 2);
        clone.dimensions = new Segment(p1, p2);
        clone.thickness = 0.1;

        return clone;
    }
}