import { colors } from "../../gui/styles";
import { ActionConcept } from "../../models/concepts/ActionConcept";
import { Registry } from "../../Registry";
import { IConceptExporter } from "./IConceptExporter";
import React = require("react");
import { ConceptType, Concept } from "../../models/concepts/Concept";

export class ActionConceptExporter implements IConceptExporter {
    type = ConceptType.MeshConcept;
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    export(hover?: (view: Concept) => void, unhover?: (view: Concept) => void): JSX.Element {
        const actionConcepts = this.registry.stores.actionStore.actions.map(actionConcept => this.renderActionConcepts(actionConcept, hover, unhover));

        return actionConcepts.length > 0 ? <g data-concept-type={ConceptType.ActionConcept} key={ConceptType.ActionConcept}>{actionConcepts}</g> : null;
    }

    private renderActionConcepts(item: ActionConcept, hover?: (view: Concept) => void, unhover?: (view: Concept) => void) {
        return (
            <g
                key={`${item.id}-group`}

                transform={`translate(${item.dimensions.topLeft.x} ${item.dimensions.topLeft.y})`}
                onMouseOver={() => hover ? hover(item) : () => undefined}
                onMouseOut={() => unhover ? unhover(item) : () => undefined}
                data-wg-x={item.dimensions.topLeft.x}
                data-wg-y={item.dimensions.topLeft.y}
                data-wg-width={item.dimensions.getWidth()}
                data-wg-height={item.dimensions.getHeight()}
                data-wg-type={item.type}
                data-wg-name={item.id}
            >
                {this.renderRect(item)}
                {this.renderContent(item)}
            </g>
        )
    }

    private renderRect(item: ActionConcept) {
        const stroke = this.registry.stores.selectionStore.contains(item) || this.registry.stores.hoverStore.contains(item) ? colors.views.highlight : 'black';

        return (
            <rect
                key={`${item.id}-rect`}
                x={`0`}
                y={`0`}
                width={`${item.dimensions.getWidth()}px`}
                height={`${item.dimensions.getHeight()}px`}
                stroke={stroke}
            />
        );
    }

    private renderContent(item: ActionConcept) {
        return (
            <foreignObject
                key={`${item.id}-content`}
                x={`0`}
                y={`0`}
                width={`${item.dimensions.getWidth()}px`}
                height={`${item.dimensions.getHeight()}px`}
            >
                <select>
                    <option>Option 1</option>
                    <option>Option 2</option>
                </select>

            </foreignObject>
        )
    }
}