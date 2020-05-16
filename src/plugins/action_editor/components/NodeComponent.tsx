import * as React from 'react';
import styled from 'styled-components';
import { colors } from '../../../core/gui/styles';
import { ConceptType } from '../../../core/models/views/View';
import { NodeView } from '../../../core/models/views/NodeView';
import { ViewComponent } from '../../common/ViewComponent';
import { GroupProps } from '../../InstanceProps';
import { createActionNodeSettingsComponent } from '../settings/nodes/actionNodeSettingsFactory';
import { JoinPointComponent } from './JoinPointComponent';

const NodeStyled = styled.div`
    background-color: ${(props: {concept: NodeView}) => props.concept.data.color};
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

export class NodeComponent extends ViewComponent<NodeView> {
    
    render() {
        return (
            <g>
                <g
                    key={`${this.props.item.id}-group`}

                    transform={`translate(${this.props.item.dimensions.topLeft.x} ${this.props.item.dimensions.topLeft.y})`}
                    data-wg-x={this.props.item.dimensions.topLeft.x}
                    data-wg-y={this.props.item.dimensions.topLeft.y}
                    data-wg-width={this.props.item.dimensions.getWidth()}
                    data-wg-height={this.props.item.dimensions.getHeight()}
                    data-wg-type={this.props.item.type}
                    data-wg-name={this.props.item.id}
                >
                    {this.renderRect(this.props.item)}
                    {this.props.renderWithSettings ? this.renderNode(this.props.item) : null}
                </g>
                {this.renderInputs(this.props.item)}
                {this.renderOutputs(this.props.item)}
            </g>
        )
    }

    private renderRect(item: NodeView) {
        return (
            <rect
                key={`${item.id}-rect`}
                x={`0`}
                y={`0`}
                width={`${item.dimensions.getWidth()}px`}
                height={`${item.dimensions.getHeight()}px`}
                stroke={this.getStrokeColor()}
            />
        );
    }

    private renderInputs(item: NodeView): JSX.Element[] {
        return item.inputs.map(input => <JoinPointComponent  item={input} registry={this.props.registry} hover={this.props.hover} unhover={this.props.unhover}/>);
    }

    private renderOutputs(item: NodeView): JSX.Element[] {
        return item.outputs.map(input => <JoinPointComponent  item={input} registry={this.props.registry} hover={this.props.hover} unhover={this.props.unhover}/>);
    }

    private renderNode(item: NodeView) {
        return (
            <foreignObject
                key={`${item.id}-content`}
                x={`0`}
                y={`0`}
                width={`${item.dimensions.getWidth()}px`}
                height={`${item.dimensions.getHeight()}px`}
            >
                <NodeStyled
                    onMouseEnter={() => this.props.hover ? this.props.hover(this.props.item) : () => undefined}
                    onMouseLeave={() => this.props.unhover ? this.props.unhover(this.props.item) : () => undefined}                
                    concept={item}
                >
                    {this.renderNodeHeader(item)}
                    {this.renderNodeBody(item)}
                    {}
                </NodeStyled>
            </foreignObject>
        )
    }

    private renderNodeHeader(item: NodeView): JSX.Element {
        return (
            <NodeHeaderStyled>{item.data.title}</NodeHeaderStyled>
        );
    } 

    private renderNodeBody(item: NodeView): JSX.Element {
        return (
            <NodeBodyStyled>{createActionNodeSettingsComponent(item, this.props.registry)}</NodeBodyStyled>
        );
    }
}

export function AllActionNodesComponent(props: GroupProps) {
    const actionConcepts = props.registry.stores.actionStore.getNodes();
    const components = actionConcepts.map(actionConcept => (
            <NodeComponent 
                item={actionConcept}
                renderWithSettings={props.renderWithSettings}
                registry={props.registry}
                hover={props.hover}
                unhover={props.unhover}
            />
        )
    );

    return actionConcepts.length > 0 ? <g data-concept-type={ConceptType.ActionConcept} key={ConceptType.ActionConcept}>{components}</g> : null;

}