import { Modifier } from "./Modifier";
import { WorldItemUtils } from "../WorldItemUtils";
import { WorldItem } from "../WorldItemInfo";
import { Segment, Polygon, Line, Point } from '@nightshifts.inc/geometry';
import { WorldItemFactory } from '../WorldItemInfoFactory';

/**
 * For external walls (walls where on of the side is not inside of the building) it creates a duplicate `WorldItemInfo` which forms an outer layer.
 * The use of this transformator is highly specialized (used only in the game 'nightshifts-inc' to apply different lights for the outer layer and the other walls), maybe it
 * should be removed in the future when custom transformators can be applied by the user.
 */
export class AddOuterBorderLayerModifier implements Modifier {
    static modName = 'addOuterBorderLayer';

    private worldItemFactory: WorldItemFactory;

    constructor(worldItemFactory: WorldItemFactory = new WorldItemFactory()) {
        this.worldItemFactory = worldItemFactory;
    }

    getName(): string {
        return AddOuterBorderLayerModifier.name;
    }

    apply(rootItems: WorldItem[]): WorldItem[] {
        const rooms = rootItems[0].children.filter(child => child.name === 'room');
        rootItems[0].children
            .filter(child => child.isBorder)
            .forEach(wall => this.addLayerIfOuterWall(rootItems[0], wall, rooms));
        return rootItems;
    }

    private addLayerIfOuterWall(root: WorldItem, wall: WorldItem, rooms: WorldItem[]) {
        const segment = <Segment> wall.dimensions;

        const perpendicularLine = segment.getPerpendicularBisector();
        const [testPoint1, testPoint2] = perpendicularLine.getSegmentWithCenterPointAndDistance(segment.getBoundingCenter(), wall.thickness / 2);

        if (rooms.find(room => (<Polygon> room.dimensions).containsPoint(testPoint1)) === undefined) {
            const outerBorder = this.createOuterLayouer(wall, testPoint1);
            wall.parent.children.push(outerBorder);
            root.borderItems.push(outerBorder);
        } else if (rooms.find(room => (<Polygon> room.dimensions).containsPoint(testPoint2)) === undefined) {
            const outerBorder = this.createOuterLayouer(wall, testPoint2);
            wall.parent.children.push(outerBorder);
            root.borderItems.push(outerBorder);
        }
    }

    private createOuterLayouer(wall: WorldItem, outerPoint: Point): WorldItem {
        const segment = <Segment> wall.dimensions;

        const clone = this.worldItemFactory.clone(wall.name, wall);
        const [p1, p2] = Line.fromPointSlopeForm(outerPoint, segment.getSlope()).getSegmentWithCenterPointAndDistance(outerPoint, segment.getLength() / 2);
        clone.dimensions = new Segment(p1, p2);
        clone.thickness = 0.1;
        clone.rooms = [wall.parent];

        return clone;
    }
}