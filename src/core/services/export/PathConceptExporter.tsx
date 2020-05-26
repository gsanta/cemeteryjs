import { ConceptType, View } from "../../models/views/View";
import { Registry } from "../../Registry";
import { IConceptExporter } from "./IConceptExporter";
import { PathComponent } from "./PathComponent";
import React = require("react");

export class PathConceptExporter implements IConceptExporter {
    type = ConceptType.PathConcept;
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    export(hover?: (item: View) => void, unhover?: (item: View) => void): JSX.Element {
        const pathes = this.registry.stores.canvasStore.getPathConcepts().map(path => {
            return <PathComponent
                key={path.id}
                onlyData={!hover}
                item={path}
                isHovered={this.registry.services.pointer.hoveredItem === path}
                isSelected={this.registry.stores.selectionStore.contains(path)}
                onMouseOver={(item: View) => hover ?  hover(item) : () => undefined}
                onMouseOut={(item: View) => unhover ? unhover(item) : () => undefined}
                registry={this.registry}
            />
        });

        return pathes.length > 0 ? 
            (
                <g data-concept-type={ConceptType.PathConcept} key={ConceptType.PathConcept}>{pathes}</g> 
            )
            : null;
    }

    exportToFile(hover?: (item: View) => void, unhover?: (item: View) => void): JSX.Element {
        return this.export(hover, unhover);
    }
}