import * as React from 'react';
import { useDrag } from 'react-dnd';
import styled from 'styled-components';
import { AccordionComponent } from '../../../core/gui//misc/AccordionComponent';
import { AppContext, AppContextType } from '../../../core/gui/Context';
import { ActionEditorPlugin } from '../ActionEditorPlugin';
import { ActionEditorSettingsProps, ActionEditorSettings } from './ActionEditorSettings';
import { CanvasToolsProps } from '../../../core/ViewFactory';
import { colors } from '../../../core/gui/styles';

const NodeButtonStyled = styled.div`
    border-bottom: 1px solid ${colors.textColor};
    padding: 2px 3px;
    cursor: pointer;

    &:hover {
        background: ${colors.hoverBackground};
    }
`;

export class ActionEditorSettingsComponent extends React.Component<{settings: ActionEditorSettings}> {
    static contextType = AppContext;
    context: AppContextType;

    render() {
        const view = this.context.registry.services.layout.getViewById(ActionEditorPlugin.id);

        return (
            <div 
                onMouseOver={() => view.setPriorityTool(this.context.registry.tools.dragAndDrop)}
                onMouseOut={() => view.removePriorityTool(this.context.registry.tools.dragAndDrop)}
            >
                {this.renderActionGroups()}
            </div>
        );
    }

    renderActionGroups() {
        const nodeTypes = this.props.settings.getVal<string[]>(ActionEditorSettingsProps.ActionTypes);
        const groups: CanvasToolsProps[] = this.props.settings.nodeGroups.map(group => {
            const items = group.members.map((nodeType) => (
                <NodeButton type={nodeType} />
            ));

            return {
                title: group.name,
                body: items
            }
        });

        return <AccordionComponent elements={groups}/>;
    }
}

const NodeButton = (props: {type: string}) => {
    const [{isDragging}, drag] = useDrag({
            item: { type: props.type },
            collect: monitor => ({
                isDragging: !!monitor.isDragging(),
            }),
      })
    
    return (
        <NodeButtonStyled ref={drag}>
            {props.type}
        </NodeButtonStyled>
    )
}