import * as React from 'react';
import styled from 'styled-components';
import { AppContext, AppContextType } from '../../../editor/gui/Context';
import { ActionEditorView } from '../ActionEditorView';
import { ActionSettingsProps } from '../settings/ActionEditorSettings';
import { useDrop } from 'react-dnd';

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
        const settings = this.context.registry.services.view.getViewById<ActionEditorView>(ActionEditorView.id).actionSettings;

        const actionTypes = settings.getVal<string[]>(ActionSettingsProps.ActionTypes);
        
        return actionTypes.map(type => (
            <ActionButtonStyled>
                {type}
            </ActionButtonStyled>
        ));
    }
}

// const ActionButton = () => {
//     const [{ isOver }, drop] = useDrop({
// 		accept: ItemTypes.KNIGHT,
// 		drop: () => moveKnight(x, y),
// 		collect: monitor => ({
// 			isOver: !!monitor.isOver(),
// 		}),
//     })
    
//     return (

//     )
// }