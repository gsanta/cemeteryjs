import { GwmWorldItemGenerator } from "../GwmWorldItemGenerator";
import { MatrixGraph } from "../../matrix_graph/MatrixGraph";
import { GwmWorldItem } from "../../model/GwmWorldItem";
import _ = require("lodash");

/**
 * Creates relationship between `GwmWorldItem`'s via adding a `GwmWorldItem` to another as
 * a child based on wheter one fully contains the other.
 */

export class HierarchyBuildingWorldItemGeneratorDecorator implements GwmWorldItemGenerator {
    private decoratedWorldItemGenerator: GwmWorldItemGenerator;
    /**
     * Restricts search for parents only these types
     */
    private parentTypes: string[];
    /**
     * Restricts search for parents only these types
     */
    private childTypes: string[];

    constructor(decoratedWorldItemGenerator: GwmWorldItemGenerator, parentTypes: string[], childTypes: string[]) {
        this.decoratedWorldItemGenerator = decoratedWorldItemGenerator;
        this.parentTypes = parentTypes;
        this.childTypes = childTypes;
    }

    public generate(graph: MatrixGraph): GwmWorldItem[] {
        return this.buildHierarchy(this.decoratedWorldItemGenerator.generate(graph));
    }

    public generateFromStringMap(strMap: string): GwmWorldItem[] {
        return this.buildHierarchy(this.decoratedWorldItemGenerator.generateFromStringMap(strMap));
    }

    public getMatrixGraphForStringMap(strMap: string): MatrixGraph {
        return this.decoratedWorldItemGenerator.getMatrixGraphForStringMap(strMap);
    }

    public buildHierarchy(worldItems: GwmWorldItem[]) {
        const parentWorldItems = worldItems//.filter(worldItem => this.parentTypes.indexOf(worldItem.name) !== -1);
        const childWorldItems = worldItems//.filter(worldItem => this.childTypes.indexOf(worldItem.name) !== -1);

        const childrenAlreadyCategorized = [];

        let rootWorldItems = worldItems;

        parentWorldItems.forEach(currentItem => {
            _.chain(childWorldItems)
                .without(...childrenAlreadyCategorized)
                .without(currentItem)
                .forEach((childItem: GwmWorldItem) => {
                    if (currentItem.dimensions.overlaps(childItem.dimensions)) {
                        currentItem.addChild(childItem);
                        childrenAlreadyCategorized.push(childItem);
                        rootWorldItems = _.without(rootWorldItems, childItem);
                    }
                })
                .value();
        });

        return rootWorldItems;
    }
}