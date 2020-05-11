import * as React from 'react';
import { colors } from "../../gui/styles";
import { ActionNodeConcept } from "../../models/concepts/ActionNodeConcept";
import { Registry } from "../../Registry";
import { IConceptExporter } from "./IConceptExporter";
import { ConceptType, Concept } from "../../models/concepts/Concept";
import { Feedback } from "../../models/feedbacks/Feedback";
import { createActionNodeSettings } from '../../../plugins/action_editor/settings/actionNodeSettingsFactory';
import styled from "styled-components";

const NodeStyled = styled.div`
    background-color: ${(props: {concept: ActionNodeConcept}) => props.concept.data.color};
    width: 100%;
    height: 100%;
`;

const NodeHeaderStyled = styled.div`
    color: ${colors.textColor};
    background-color: ${colors.panelBackground};
    padding: 3px 5px;
`;

const NodeBodyStyled = styled.div`
    padding: 0px 10px 3px 10px;
    font-size: 12px;

    .input-label {
        font-weight: bold;
    }
`;

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
                {renderWithSettings ? this.renderNode(item) : null}
                {this.renderInputSlots(item)}
                {this.renderOutputSlots(item)}
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

    private renderInputSlots(item: ActionNodeConcept): JSX.Element[] {
        const slots: JSX.Element[] = [];
        const yStart = 50;

        for (let i = 0; i < item.data.inputSlots; i++) {
            slots.push(
                <circle 
                    cx={0} 
                    cy={i * 20 + yStart} 
                    r={4}
                    stroke={colors.panelBackground}
                    fill={colors.grey4}
                />
            )
        }

        return slots;
    }

    private renderOutputSlots(item: ActionNodeConcept): JSX.Element[] {
        const slots: JSX.Element[] = [];
        const yStart = 50;

        for (let i = 0; i < item.data.outputSlots; i++) {
            slots.push(
                <circle 
                    cx={item.dimensions.getWidth()} 
                    cy={i * 20 + yStart} 
                    r={4}
                    stroke={colors.panelBackground}
                    fill={colors.grey4}
                />
            )
        }

        return slots;
    }

    private renderNode(item: ActionNodeConcept) {
        return (
            <foreignObject
                key={`${item.id}-content`}
                x={`0`}
                y={`0`}
                width={`${item.dimensions.getWidth()}px`}
                height={`${item.dimensions.getHeight()}px`}
            >
                <NodeStyled concept={item}>
                    {this.renderNodeHeader(item)}
                    {this.renderNodeBody(item)}
                    {}
                </NodeStyled>
            </foreignObject>
        )
    }

    private renderNodeHeader(item: ActionNodeConcept): JSX.Element {
        return (
            <NodeHeaderStyled>{item.data.title}</NodeHeaderStyled>
        );
    } 

    private renderNodeBody(item: ActionNodeConcept): JSX.Element {
        return (
            <NodeBodyStyled>{createActionNodeSettings(item, this.registry)}</NodeBodyStyled>
        );
    }
}