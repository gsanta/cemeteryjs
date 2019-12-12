import { GameObject } from "../types/GameObject";
import { Modifier } from "./Modifier";
import { Shape, Point } from "@nightshifts.inc/geometry";
import { TreeIteratorGenerator } from "../utils/TreeIteratorGenerator";

export class TransformToWorldCoordinateModifier implements Modifier {
    static modName = 'transformToWorldCoordinate';
    dependencies = [];

    getName(): string {
        return TransformToWorldCoordinateModifier.modName;
    }

    apply(worldItems: GameObject[]): GameObject[] {
        worldItems.forEach(rootItem => {
            for (const item of TreeIteratorGenerator(rootItem)) {
                // TODO: root item should not be a special case
                if (item !== rootItem) {
                    item.dimensions = item.dimensions.negate('x');
                }
            }
        });

        return worldItems;
    }
}