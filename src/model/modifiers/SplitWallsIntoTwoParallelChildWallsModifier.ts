import { Measurements, Segment } from '@nightshifts.inc/geometry';
import { WorldItem } from "../../WorldItem";
import { WorldItemFactoryService } from '../services/WorldItemFactoryService';
import { Modifier } from "./Modifier";
import { ThickenBordersModifier } from "./ThickenBordersModifier";

export class SplitWallsIntoTwoParallelChildWallsModifier implements Modifier {
    static modName = 'splitWallsIntoTwoParallelChildWalls';
    dependencies = [ThickenBordersModifier.modName];

    private worldItemFactory: WorldItemFactoryService;

    constructor(worldItemFactory: WorldItemFactoryService) {
        this.worldItemFactory = worldItemFactory;
    }

    getName(): string {
        return SplitWallsIntoTwoParallelChildWallsModifier.modName;
    }

    apply(rootItems: WorldItem[]): WorldItem[] {
        rootItems[0].children
            .filter(child => child.isBorder)
            .forEach(wall => this.splitWallIntoTwoSides(wall));

        return rootItems;
    }

    private splitWallIntoTwoSides(wall: WorldItem) {
        const wallEdge = <Segment> wall.dimensions;
        const poly = (<Segment> wall.dimensions).addThickness(wall.thickness / 2);

        const twoWallHalves = poly.getEdges()
            .filter(edge => new Measurements().linesParallel(edge.getLine(), wallEdge.getLine()))
            .map(parallelEdge => {
                const worldItem = this.worldItemFactory.clone(wall.name, wall);
                worldItem.dimensions = new Segment(parallelEdge.getPoints()[0], parallelEdge.getPoints()[1]);
                worldItem.thickness = wall.thickness / 2;
                worldItem.children = [];

                return worldItem;
            });

        wall.children = [...twoWallHalves];
    }
}