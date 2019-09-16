import { Modifier } from "./Modifier";
import { WorldItem } from "../WorldItem";
import { Segment, Polygon, Line, Point, GeometryService } from '@nightshifts.inc/geometry';
import { WorldItemFactoryService } from '../services/WorldItemFactoryService';
import { ThickenBordersModifier } from "./ThickenBordersModifier";

/**
 * For external walls (walls where on of the side is not inside of the building) it creates a duplicate `WorldItem` which forms an outer layer.
 * The use of this transformator is highly specialized (used only in the game 'nightshifts-inc' to apply different lights for the outer layer and the other walls), maybe it
 * should be removed in the future when custom transformators can be applied by the user.
 */
export class AddOuterBorderLayerModifier implements Modifier {
    static modName = 'addOuterBorderLayer';
    dependencies = [ThickenBordersModifier.modName];

    private worldItemFactory: WorldItemFactoryService;
    private geometryService: GeometryService;

    constructor(worldItemFactory: WorldItemFactoryService, geometryService: GeometryService) {
        this.worldItemFactory = worldItemFactory;
        this.geometryService = geometryService;
    }

    getName(): string {
        return AddOuterBorderLayerModifier.modName;
    }

    apply(rootItems: WorldItem[]): WorldItem[] {
        const rooms = rootItems[0].children.filter(child => child.name === 'room');
        rootItems[0].children
            .filter(child => child.isBorder)
            .forEach(wall => this.splitWallIntoTwoSides(wall));
            // .forEach(wall => this.addLayerIfOuterWall(rootItems[0], wall, rooms));
        return rootItems;
    }

    private splitWallIntoTwoSides(wall: WorldItem) {
        const wallEdge = <Segment> wall.dimensions;
        const poly = (<Segment> wall.dimensions).addThickness(wall.thickness);

        const twoWallHalves = poly.getEdges()
            .filter(edge => this.geometryService.measuerments.linesParallel(edge.getLine(), wallEdge.getLine()))
            .map(parallelEdge => {
                const worldItem = this.worldItemFactory.clone(wall.name, wall);
                worldItem.dimensions = this.geometryService.factory.edge(parallelEdge.getPoints()[0], parallelEdge.getPoints()[1]);
                worldItem.thickness = wall.thickness / 2;
                worldItem.children = [];

                return worldItem;
            });

        wall.children.push(...twoWallHalves);
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