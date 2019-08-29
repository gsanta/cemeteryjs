import { WorldItemParser } from "../parsers/WorldItemParser";
import { MatrixGraph } from "../matrix_graph/MatrixGraph";
import { WorldItemInfo } from "../WorldItemInfo";
import { WorldItemTransformator } from '../transformators/WorldItemTransformator';
import _ = require("lodash");
import { Polygon } from "@nightshifts.inc/geometry";

/**
 * Creates relationship between `WorldItemInfo`'s via adding a `WorldItemInfo` to another as
 * a child based on wheter one fully contains the other.
 */

export class BuildHierarchyModifier implements WorldItemTransformator {
    public transform(gwmWorldItems: WorldItemInfo[]): WorldItemInfo[] {
        return this.buildHierarchy(gwmWorldItems);
    }

    public buildHierarchy(worldItems: WorldItemInfo[]) {
        const childrenAlreadyCategorized = [];

        let rootWorldItems = worldItems;

        worldItems.forEach(currentItem => {
            _.chain(worldItems)
                .without(...childrenAlreadyCategorized)
                .without(currentItem)
                .forEach((childItem: WorldItemInfo) => {
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