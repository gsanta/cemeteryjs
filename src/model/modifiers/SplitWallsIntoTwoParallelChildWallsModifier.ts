import { GeometryService, Segment } from '@nightshifts.inc/geometry';
import { WorldItemFactoryService } from '../../services/WorldItemFactoryService';
import { WorldItem } from "../../WorldItem";
import { Modifier } from "./Modifier";
import { ThickenBordersModifier } from "./ThickenBordersModifier";

export class SplitWallsIntoTwoParallelChildWallsModifier implements Modifier {
    static modName = 'splitWallsIntoTwoParallelChildWalls';
    dependencies = [ThickenBordersModifier.modName];

    private worldItemFactory: WorldItemFactoryService;
    private geometryService: GeometryService;

    constructor(worldItemFactory: WorldItemFactoryService, geometryService: GeometryService) {
        this.worldItemFactory = worldItemFactory;
        this.geometryService = geometryService;
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
            .filter(edge => this.geometryService.measuerments.linesParallel(edge.getLine(), wallEdge.getLine()))
            .map(parallelEdge => {
                const worldItem = this.worldItemFactory.clone(wall.name, wall);
                worldItem.dimensions = this.geometryService.factory.edge(parallelEdge.getPoints()[0], parallelEdge.getPoints()[1]);
                worldItem.thickness = wall.thickness / 2;
                worldItem.children = [];

                return worldItem;
            });

        wall.children = [...twoWallHalves];
    }
}