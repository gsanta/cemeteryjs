import { WorldItem } from "../../WorldItem";
import { Modifier } from './Modifier';
import { Polygon } from "@nightshifts.inc/geometry";
import { SegmentBordersModifier } from './SegmentBordersModifier';
import { without } from "../utils/ArrayUtils";

/**
 * Creates relationship between `WorldItem`'s via adding a `WorldItem` to another as
 * a child based on wheter one fully contains the other.
 */

export class BuildHierarchyModifier implements Modifier {
    static modName = 'buildHierarchy';
    dependencies = [SegmentBordersModifier.modName]

    getName(): string {
        return BuildHierarchyModifier.modName;
    }

    apply(gwmWorldItems: WorldItem[]): WorldItem[] {
        return this.buildHierarchy(gwmWorldItems);
    }

    buildHierarchy(worldItems: WorldItem[]) {
        const childrenAlreadyCategorized = [];

        let rootWorldItems = worldItems;

        worldItems.forEach(currentItem => {

            return without(worldItems, ...[childrenAlreadyCategorized, currentItem])
                .forEach((childItem: WorldItem) => {
                    if ((<Polygon>currentItem.dimensions).contains(<Polygon> childItem.dimensions)) {
                        // this condition ensures that no two items will be each other's children if they would have the
                        // same size
                        if (childItem.children.indexOf(currentItem) === -1) {
                            currentItem.addChild(childItem);
                            childItem.parent = currentItem;
                            childrenAlreadyCategorized.push(childItem);
                            rootWorldItems = without(rootWorldItems, childItem);
                        }
                    }
                });
        });

        return rootWorldItems;
    }
}