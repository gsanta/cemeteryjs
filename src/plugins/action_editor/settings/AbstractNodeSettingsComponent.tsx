
import * as React from 'react';
import { AppContext, AppContextType } from '../../../core/gui/Context';
import { NodeProps } from './nodes/actionNodeSettingsFactory';
import styled from 'styled-components';

const SlotRowStyled = styled.div`
    display: flex;
    justify-content: space-between;
`;

export class AbstractNodeSettingsComponent extends React.Component<NodeProps> {
    static contextType = AppContext;
    context: AppContextType;


    protected renderSlots(): JSX.Element[] {
        const inputSlots = this.props.settings.view.data.inputSlots;
        const outputSlots = this.props.settings.view.data.outputSlots;
    
        const rows = inputSlots.length > outputSlots.length ? inputSlots.length : outputSlots.length;

        const slots: JSX.Element[] = [];
        for (let i = 0; i < rows; i++) {
            slots.push(
                <SlotRowStyled>
                    <div>{inputSlots.length > i ? inputSlots[i].name : null}</div>
                    <div>{outputSlots.length > i ? outputSlots[i].name : null}</div>
                </SlotRowStyled>
            )
        }

        return slots;
    }
}