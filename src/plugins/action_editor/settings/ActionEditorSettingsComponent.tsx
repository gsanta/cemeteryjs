import * as React from 'react';
import { useDrag } from 'react-dnd';
import styled from 'styled-components';
import { AppContext, AppContextType } from '../../../core/gui/Context';
import { ActionEditorView } from '../ActionEditorView';
import { ActionEditorSettingsProps } from './ActionEditorSettings';

const ActionButtonStyled = styled.div`
    border: 1px solid white;
    cursor: pointer;
`;

export class ActionEditorSettingsComponent extends React.Component {
    static contextType = AppContext;
    context: AppContextType;

    render() {
        const view = this.context.registry.services.layout.getViewById(ActionEditorView.id);

        return (
            <div 
                onMouseOver={() => view.setPriorityTool(this.context.registry.tools.dragAndDrop)}
                onMouseOut={() => view.removePriorityTool(this.context.registry.tools.dragAndDrop)}
            >
                {this.renderActionTypes()}
            </div>
        );
    }

    renderActionTypes() {
        const view = this.context.registry.services.layout.getViewById(ActionEditorView.id);
        const settings = this.context.registry.services.layout.getViewById<ActionEditorView>(ActionEditorView.id).actionSettings;

        const actionTypes = settings.getVal<string[]>(ActionEditorSettingsProps.ActionTypes);
        
        return actionTypes.map(type => {
            return (
                <ActionButton 
                    type={type} 
                    onDragStart={() => undefined/*view.setPriorityTool(this.context.registry.tools.dragAndDrop)*/}
                    onDragEnd={() => {
                        const currentMousePos = this.context.registry.services.pointer.pointer.curr;
                        // this.context.registry.services.mouse.onMouseUp({x: currentMousePos.x, y: currentMousePos.y, which: 1} as MouseEvent)
                    }}
                    // }}
                />
            );
        });
    }
}

const ActionButton = (props: {type: string, onDragStart: () => void, onDragEnd: () => void}) => {
    const [{isDragging}, drag] = useDrag({
        item: { type: props.type },
            collect: monitor => ({
                isDragging: !!monitor.isDragging(),
            }),
            begin: () => props.onDragStart(),
            end: (item, monitor) => props.onDragEnd()
      })
    
    return (
        <ActionButtonStyled ref={drag}>
            {props.type}
        </ActionButtonStyled>
    )
}