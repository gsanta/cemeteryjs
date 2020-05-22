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
                // onMouseOver={() => view.setPriorityTool(this.context.registry.tools.dragAndDrop)}
                // onMouseOut={() => view.removePriorityTool(this.context.registry.tools.dragAndDrop)}
            >
                {this.renderActionGroups()}
            </div>
        );
    }

    renderPresets() {
        const view = this.context.registry.services.layout.getViewById(ActionEditorPlugin.id);
        const presets: string[] = this.props.settings.getVal(ActionEditorSettingsProps.Presets);

        const groups: CanvasToolsProps[] = presets.map(preset => {
            return (
                <NodeButton 
                    key={preset} type={nodeType} 
                    onMouseDown={() => view.setPriorityTool(this.context.registry.tools.dragAndDrop)}
                    onDrop={() => view.removePriorityTool(this.context.registry.tools.dragAndDrop)}
                />
            );

            return {
                title: preset.name,
                body: items
            }
        });

        return <AccordionComponent elements={groups}/>;
    }

    renderActionGroups() {
        const view = this.context.registry.services.layout.getViewById(ActionEditorPlugin.id);

        const groups: CanvasToolsProps[] = this.props.settings.nodeGroups.map(group => {
            const items = group.members.map((nodeType) => (
                <NodeButton 
                    key={nodeType} type={nodeType} 
                    onMouseDown={() => view.setPriorityTool(this.context.registry.tools.dragAndDrop)}
                    onDrop={() => view.removePriorityTool(this.context.registry.tools.dragAndDrop)}
                />
            ));

            return {
                title: group.name,
                body: items
            }
        });

        return <AccordionComponent elements={groups}/>;
    }
}

const NodeButton = (props: {type: string, onMouseDown: () => void, onDrop: () => void}) => {
    const [{isDragging}, drag] = useDrag({
            item: { type: props.type },
            collect: monitor => ({
                isDragging: !!monitor.isDragging(),
            }),
            end: (item, monitor) => props.onDrop()
      })
    
    return (
        <NodeButtonStyled ref={drag} onMouseDown={() => props.onMouseDown()}>
            {props.type}
        </NodeButtonStyled>
    )
}