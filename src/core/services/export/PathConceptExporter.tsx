import { Registry } from "../../Registry";
import { Feedback } from "../../models/feedbacks/Feedback";
import { IConceptExporter } from "./IConceptExporter";
import { PathComponent } from "./PathComponent";
import React = require("react");
import { ConceptType, Concept } from "../../models/concepts/Concept";

export class PathConceptExporter implements IConceptExporter {
    type = ConceptType.PathConcept;
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    export(hover?: (item: Concept | Feedback) => void, unhover?: (item: Concept | Feedback) => void): JSX.Element {
        const pathes = this.registry.stores.canvasStore.getPathConcepts().map(path => {
            return <PathComponent
                key={path.id}
                onlyData={!hover}
                item={path}
                isHovered={this.registry.stores.hoverStore.contains(path)}
                isSelected={this.registry.stores.selectionStore.contains(path)}
                onMouseOver={(item: Concept | Feedback) => hover ?  hover(item) : () => undefined}
                onMouseOut={(item: Concept | Feedback) => unhover ? unhover(item) : () => undefined}
                stores={this.registry.stores}
            />
        });

        return pathes.length > 0 ? 
            (
                <g data-concept-type={ConceptType.PathConcept} key={ConceptType.PathConcept}>{pathes}</g> 
            )
            : null;
    }
}