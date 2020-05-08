import * as React from 'react';
import styled from 'styled-components';
import { AppContext, AppContextType } from '../../../editor/gui/Context';
import { ActionEditorView } from '../ActionEditorView';
import { ActionSettingsProps } from '../settings/ActionEditorSettings';
import { useDrop, useDrag } from 'react-dnd';

const ActionButtonStyled = styled.div`
    border: 1px solid white;
    cursor: pointer;
`;

export class ActionEditorSettingsComponent extends React.Component {
    static contextType = AppContext;
    context: AppContextType;

    render() {
        return (
            <div>
                {this.renderActionTypes()}
            </div>
        );
    }

    renderActionTypes() {
        const view = this.context.registry.services.view.getViewById(ActionEditorView.id);
        const settings = this.context.registry.services.view.getViewById<ActionEditorView>(ActionEditorView.id).actionSettings;

        const actionTypes = settings.getVal<string[]>(ActionSettingsProps.ActionTypes);
        
        return actionTypes.map(type => (
            <ActionButton 
                type={type} 
                onDragStart={() => view.setPriorityTool(this.context.registry.services.tools.dragAndDrop)}
                onDragEnd={() => this.context.registry.services.tools.dragAndDrop.up()}
            />
        ));
    }
}

const ActionButton = (props: {type: string, onDragStart: () => void, onDragEnd: () => void}) => {
    const [{isDragging}, drag] = useDrag({
        item: { type: props.type },
            collect: monitor => ({
                isDragging: !!monitor.isDragging(),
            }),
            begin: () => props.onDragStart(),
            end: () => props.onDragEnd()
      })
    
    return (
        <ActionButtonStyled ref={drag}>
            {props.type}
        </ActionButtonStyled>
    )
}