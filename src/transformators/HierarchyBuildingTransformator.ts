import { WorldItemParser } from "../parsers/WorldItemParser";
import { MatrixGraph } from "../matrix_graph/MatrixGraph";
import { WorldItemInfo } from "../WorldItemInfo";
import { WorldItemTransformator } from './WorldItemTransformator';
import _ = require("lodash");

/**
 * Creates relationship between `WorldItemInfo`'s via adding a `WorldItemInfo` to another as
 * a child based on wheter one fully contains the other.
 */

export class HierarchyBuildingTransformator implements WorldItemTransformator {
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
                    if (currentItem.dimensions.contains(childItem.dimensions)) {
                        // this condition ensures that no two items will be each other's children if they would have the
                        // same size
                        if (childItem.children.indexOf(currentItem) === -1) {
                            currentItem.addChild(childItem);
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