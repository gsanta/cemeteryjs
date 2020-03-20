import { IConceptExporter } from "../../views/canvas/tools/IConceptExporter";
import React = require("react");
import { PathComponent } from "./PathComponent";
import { PathConcept, PathPointConcept } from "../../views/canvas/models/concepts/PathConcept";
import { ConceptType, Concept, Subconcept } from "../../views/canvas/models/concepts/Concept";
import { Stores } from '../../stores/Stores';
import { CanvasTag } from "../../views/canvas/CanvasView";

export class PathConceptExporter implements IConceptExporter {
    type = ConceptType.Path;
    private getStores: () => Stores;

    constructor(getStores: () => Stores) {
        this.getStores = getStores;
    }

    export(hover?: (concept: Concept, subconcept?: Subconcept) => void, unhover?: (concept: Concept, subconcept?: Subconcept) => void): JSX.Element {
        const pathes = this.getStores().conceptStore.getPathes().map(path => {
            return <PathComponent
                key={path.name}
                onlyData={!hover}
                item={path}
                isHovered={this.getStores().conceptStore.getHoveredView() === path}
                isSelected={this.getStores().conceptStore.getTags(path).has(CanvasTag.Selected)}
                onMouseOver={(item: PathConcept, pathPoint?: PathPointConcept) => hover ?  hover(item, pathPoint) : () => undefined}
                onMouseOut={(item: PathConcept, pathPoint?: PathPointConcept) => unhover ? unhover(item, pathPoint) : () => undefined}
            />
        });

        return pathes.length > 0 ? 
            (
                <g data-view-type={ConceptType.Path}>{pathes}</g> 
            )
            : null;
    }
}