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

    constructor(decoratedWorldItemGenerator: GwmWorldItemGenerator) {
        this.decoratedWorldItemGenerator = decoratedWorldItemGenerator;
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