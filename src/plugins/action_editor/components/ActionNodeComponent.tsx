import * as React from 'react';
import styled from 'styled-components';
import { colors } from '../../../core/gui/styles';
import { ActionNodeConcept } from '../../../core/models/concepts/ActionNodeConcept';
import { InstanceProps } from '../../InstanceProps';
import { createActionNodeSettings } from '../settings/actionNodeSettingsFactory';

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

export class ActionNodeComponent extends React.Component<InstanceProps<ActionNodeConcept>> {
    
    render() {
        return (
            <g
                key={`${this.props.item.id}-group`}

                transform={`translate(${this.props.item.dimensions.topLeft.x} ${this.props.item.dimensions.topLeft.y})`}
                onMouseOver={() => this.props.hover ? this.props.hover(this.props.item) : () => undefined}
                onMouseOut={() => this.props.unhover ? this.props.unhover(this.props.item) : () => undefined}
                data-wg-x={this.props.item.dimensions.topLeft.x}
                data-wg-y={this.props.item.dimensions.topLeft.y}
                data-wg-width={this.props.item.dimensions.getWidth()}
                data-wg-height={this.props.item.dimensions.getHeight()}
                data-wg-type={this.props.item.type}
                data-wg-name={this.props.item.id}
            >
                {this.renderRect(this.props.item)}
                {this.props.renderWithSettings ? this.renderNode(this.props.item) : null}
                {this.renderInputSlots(this.props.item)}
                {this.renderOutputSlots(this.props.item)}
            </g>
        )
    }

    private renderRect(item: ActionNodeConcept) {
        const stroke = this.props.registry.stores.selectionStore.contains(item) || this.props.registry.stores.hoverStore.contains(item) ? colors.views.highlight : 'black';

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
            <NodeBodyStyled>{createActionNodeSettings(item, this.props.registry)}</NodeBodyStyled>
        );
    }
}