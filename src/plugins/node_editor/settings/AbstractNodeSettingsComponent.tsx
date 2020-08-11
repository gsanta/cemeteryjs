
import * as React from 'react';
import { AppContext, AppContextType } from '../../../core/ui_regions/components/Context';
import { NodeProps } from './nodes/nodeSettingsFactory';
import styled from 'styled-components';
import { sizes } from '../../../core/ui_regions/components/styles';

const SlotRowStyled = styled.div`
    height: ${sizes.nodes.slotHeight}px;
    display: flex;
    justify-content: space-between;
    font-weight: bold;

    > div {
        height: ${sizes.nodes.slotHeight}px;
    }
`;

export class AbstractNodeSettingsComponent extends React.Component<NodeProps> {
    static contextType = AppContext;
    context: AppContextType;


    protected renderSlots(): JSX.Element[] {
        const inputSlots = this.props.settings.nodeView.model.inputSlots;
        const outputSlots = this.props.settings.nodeView.model.outputSlots;
    
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