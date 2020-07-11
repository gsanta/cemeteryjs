

import * as React from 'react';
import styled from 'styled-components';
import { ToolIconProps } from '../../../plugins/common/toolbar/icons/ToolIcon';
import { iconFactory } from '../icons/iconFactory';
import { colors } from '../styles';
import { UI_Button } from '../../gui_builder/elements/UI_Button';

export const Buttontyled = styled.div`
    display: flex;
    align-items: center;
    cursor: ${(props: ToolIconProps) => props.disabled ? 'default' : 'pointer'};
    padding: ${(props: ToolIconProps) => props.format === 'long' ? '3px' : '0px'};
    opacity: ${(props: ToolIconProps) => props.disabled ? '0.4' : '1'};
    color: ${(props: ToolIconProps) => props.color ? props.color : colors.textColor};
    width: 100%;

    &:hover {
        background: ${colors.hoverBackground};
    }

    .button-label {
        padding-left: 5px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`;

export interface Button_UI_Props {
    element: UI_Button;
}

export class ButtonComp extends React.Component<Button_UI_Props> {

    render() {
        const icon = this.props.element.icon ? iconFactory(this.props.element.icon) : null;

        return (
            <Buttontyled {...this.props} onClick={() => this.props.element.click()}>
                {icon}
                
                <div className="button-label">
                    {this.props.element.label}
                </div>
            </Buttontyled>   
        )
    }
}