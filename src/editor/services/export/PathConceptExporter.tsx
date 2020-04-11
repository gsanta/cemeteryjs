import { IConceptExporter } from "./IConceptExporter";
import React = require("react");
import { PathComponent } from "./PathComponent";
import { Stores } from '../../stores/Stores';
import { ConceptType, Concept } from "../../views/canvas/models/concepts/Concept";
import { Feedback } from "../../views/canvas/models/feedbacks/Feedback";

export class PathConceptExporter implements IConceptExporter {
    type = ConceptType.PathConcept;
    private getStores: () => Stores;

    constructor(getStores: () => Stores) {
        this.getStores = getStores;
    }

    export(hover?: (item: Concept | Feedback) => void, unhover?: (item: Concept | Feedback) => void): JSX.Element {
        const pathes = this.getStores().canvasStore.getPathConcepts().map(path => {
            return <PathComponent
                key={path.id}
                onlyData={!hover}
                item={path}
                isHovered={this.getStores().hoverStore.contains(path)}
                isSelected={this.getStores().selectionStore.contains(path)}
                onMouseOver={(item: Concept | Feedback) => hover ?  hover(item) : () => undefined}
                onMouseOut={(item: Concept | Feedback) => unhover ? unhover(item) : () => undefined}
                stores={this.getStores()}
            />
        });

        return pathes.length > 0 ? 
            (
                <g data-concept-type={ConceptType.PathConcept} key={ConceptType.PathConcept}>{pathes}</g> 
            )
            : null;
    }
}