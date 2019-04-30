import { GwmWorldItemParser } from "../parsers/GwmWorldItemParser";
import { MatrixGraph } from "../matrix_graph/MatrixGraph";
import { GwmWorldItem } from "../model/GwmWorldItem";
import { GwmWorldItemTransformator } from './GwmWorldItemTransformator';
import _ = require("lodash");

/**
 * Creates relationship between `GwmWorldItem`'s via adding a `GwmWorldItem` to another as
 * a child based on wheter one fully contains the other.
 */

export class HierarchyBuildingTransformator implements GwmWorldItemTransformator {
    public transform(gwmWorldItems: GwmWorldItem[]): GwmWorldItem[] {
        return this.buildHierarchy(gwmWorldItems);
    }

    public buildHierarchy(worldItems: GwmWorldItem[]) {
        const childrenAlreadyCategorized = [];

        let rootWorldItems = worldItems;

        worldItems.forEach(currentItem => {
            _.chain(worldItems)
                .without(...childrenAlreadyCategorized)
                .without(currentItem)
                .forEach((childItem: GwmWorldItem) => {
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