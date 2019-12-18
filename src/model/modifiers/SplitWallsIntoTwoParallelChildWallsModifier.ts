import { GameObject } from "../types/GameObject";
import { GameObjectFactory } from '../services/GameObjectFactory';
import { Modifier } from "./Modifier";
import { ThickenBordersModifier } from "./ThickenBordersModifier";
import { Segment } from "../../geometry/shapes/Segment";
import { Measurements } from "../../geometry/utils/Measurements";

export class SplitWallsIntoTwoParallelChildWallsModifier implements Modifier {
    static modName = 'splitWallsIntoTwoParallelChildWalls';
    dependencies = [ThickenBordersModifier.modName];

    private worldItemFactory: GameObjectFactory;

    constructor(worldItemFactory: GameObjectFactory) {
        this.worldItemFactory = worldItemFactory;
    }

    getName(): string {
        return SplitWallsIntoTwoParallelChildWallsModifier.modName;
    }

    apply(rootItems: GameObject[]): GameObject[] {
        rootItems[0].children
            .filter(child => child.isBorder)
            .forEach(wall => this.splitWallIntoTwoSides(wall));

        return rootItems;
    }

    private splitWallIntoTwoSides(wall: GameObject) {
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