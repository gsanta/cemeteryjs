import { colors } from "../../gui/styles";
import { ActionNodeConcept } from "../../models/concepts/ActionNodeConcept";
import { Registry } from "../../Registry";
import { IConceptExporter } from "./IConceptExporter";
import React = require("react");
import { ConceptType, Concept } from "../../models/concepts/Concept";
import { Feedback } from "../../models/feedbacks/Feedback";
import { createActionNodeSettings } from '../../../plugins/action_editor/settings/actionNodeSettingsFactory';

export class ActionConceptExporter implements IConceptExporter {
    type = ConceptType.MeshConcept;
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    export(hover?: (view: Concept) => void, unhover?: (view: Concept) => void): JSX.Element {
        return this.render(true, hover, unhover);
    }

    exportToFile(hover?: (item: Concept | Feedback) => void, unhover?: (item: Concept | Feedback) => void): JSX.Element {
        return this.render(false, hover, unhover);

    }

    private render(renderWithSettings: boolean, hover?: (item: Concept | Feedback) => void, unhover?: (item: Concept | Feedback) => void) {
        const actionConcepts = this.registry.stores.actionStore.actions.map(actionConcept => this.renderActionConcepts(actionConcept, renderWithSettings, hover, unhover));

        return actionConcepts.length > 0 ? <g data-concept-type={ConceptType.ActionConcept} key={ConceptType.ActionConcept}>{actionConcepts}</g> : null;

    }

    private renderActionConcepts(item: ActionNodeConcept, renderWithSettings: boolean, hover?: (view: Concept) => void, unhover?: (view: Concept) => void) {
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
                {renderWithSettings ? this.renderContent(item) : null}
            </g>
        )
    }

    private renderRect(item: ActionNodeConcept) {
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

    private renderContent(item: ActionNodeConcept) {
        return (
            <foreignObject
                key={`${item.id}-content`}
                x={`0`}
                y={`0`}
                width={`${item.dimensions.getWidth()}px`}
                height={`${item.dimensions.getHeight()}px`}
            >
                {createActionNodeSettings(item.data.type, this.registry)}
            </foreignObject>
        )
    }
}