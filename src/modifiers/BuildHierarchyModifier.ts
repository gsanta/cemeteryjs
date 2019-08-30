import { WorldItemParser } from "../parsers/WorldItemParser";
import { MatrixGraph } from "../matrix_graph/MatrixGraph";
import { WorldItem } from "../WorldItemInfo";
import { Modifier } from './Modifier';
import _ = require("lodash");
import { Polygon } from "@nightshifts.inc/geometry";
import { SegmentBordersModifier } from './SegmentBordersModifier';

/**
 * Creates relationship between `WorldItemInfo`'s via adding a `WorldItemInfo` to another as
 * a child based on wheter one fully contains the other.
 */

export class BuildHierarchyModifier implements Modifier {
    static modName = 'buildHierarchy';
    dependencies = [SegmentBordersModifier.modName]

    getName(): string {
        return BuildHierarchyModifier.name;
    }

    apply(gwmWorldItems: WorldItem[]): WorldItem[] {
        return this.buildHierarchy(gwmWorldItems);
    }

    buildHierarchy(worldItems: WorldItem[]) {
        const childrenAlreadyCategorized = [];

        let rootWorldItems = worldItems;

        worldItems.forEach(currentItem => {
            _.chain(worldItems)
                .without(...childrenAlreadyCategorized)
                .without(currentItem)
                .forEach((childItem: WorldItem) => {
                    if ((<Polygon>currentItem.dimensions).contains(<Polygon> childItem.dimensions)) {
                        // this condition ensures that no two items will be each other's children if they would have the
                        // same size
                        if (childItem.children.indexOf(currentItem) === -1) {
                            currentItem.addChild(childItem);
                            childItem.parent = currentItem;
                            childrenAlreadyCategorized.push(childItem);
                            rootWorldItems = _.without(rootWorldItems, childItem);
                        }
                    }
                })
                .value();
        });

        return rootWorldItems;
    }
}