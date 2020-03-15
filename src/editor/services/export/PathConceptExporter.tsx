import { IConceptExporter } from "../../views/canvas/tools/IConceptExporter";
import React = require("react");
import { PathComponent } from "./PathComponent";
import { PathConcept } from "../../views/canvas/models/concepts/PathConcept";
import { ConceptType, Concept } from "../../views/canvas/models/concepts/Concept";
import { Stores } from '../../stores/Stores';
import { CanvasTag } from "../../views/canvas/CanvasView";

export class PathConceptExporter implements IConceptExporter {
    type = ConceptType.Path;
    private getStores: () => Stores;

    constructor(getStores: () => Stores) {
        this.getStores = getStores;
    }

    export(hover?: (view: Concept) => void, unhover?: (view: Concept) => void): JSX.Element {
        const pathes = this.getStores().conceptStore.getPathes().map(path => {
            return <PathComponent
                key={path.name}
                onlyData={!hover}
                item={path}
                isHovered={this.getStores().conceptStore.getHoveredView() === path}
                isSelected={this.getStores().conceptStore.getTags(path).has(CanvasTag.Selected)}
                onMouseOver={(item: PathConcept) => hover ?  hover(item) : () => undefined}
                onMouseOut={(item: PathConcept) => unhover ? unhover(item) : () => undefined}
            />
        });

        return pathes.length > 0 ? 
            (
                <g data-view-type={ConceptType.Path}>{pathes}</g> 
            )
            : null;
    }
}