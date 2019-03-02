import { GwmWorldItem } from '../model/GwmWorldItem';
import * as _ from 'lodash';

/**
 * Creates relationship between `GwmWorldItem`'s via adding a `GwmWorldItem` to another as
 * a child based on wheter one fully contains the other.
 */
export class WorldItemHierarchyBuilder {
    /**
     * Restricts search for parents only these types
     */
    private parentTypes: string[];
    /**
     * Restricts search for parents only these types
     */
    private childTypes: string[];

    constructor(parentTypes: string[], childTypes: string[]) {
        this.parentTypes = parentTypes;
        this.childTypes = childTypes;
    }


    public build(worldItems: GwmWorldItem[]) {
        const parentWorldItems = worldItems.filter(worldItem => this.parentTypes.indexOf(worldItem.name) !== -1);
        const childWorldItems = worldItems.filter(worldItem => this.childTypes.indexOf(worldItem.name) !== -1);

        const childrenAlreadyCategorized = [];

        parentWorldItems.forEach(parentItem => {
            _.chain(childWorldItems)
                .without(...childrenAlreadyCategorized)
                .forEach((childItem: GwmWorldItem) => {
                    if (parentItem.dimensions.overlaps(childItem.dimensions)) {
                        parentItem.addChild(childItem);
                        childrenAlreadyCategorized.push(childItem);
                    }
                })
                .value();
        });
    }
}