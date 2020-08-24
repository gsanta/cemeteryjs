import * as React from 'react';
import styled from 'styled-components';
import { colors } from '../../../../core/ui_components/react/styles';
import { ToolStyled, ToolIconStyled, ToolNameStyled, ToolIconProps } from './ToolIcon';
import { AbstractIconComponent } from './AbstractIconComponent';

const IconBackgroundComponent = styled.path`
    fill: ${({isActive}: {isActive: boolean}) => isActive ? colors.active : colors.grey3};
`;

const TrashComponent = styled.path`
    fill: ${({isActive}: {isActive: boolean}) => isActive ? colors.grey3 : colors.textColor};
`;

const TrashHoleComponent = styled.path`
    fill: ${({isActive}: {isActive: boolean}) => isActive ? colors.active : colors.grey3};
`;

export class DeleteIconComponent extends AbstractIconComponent {

    constructor(props: ToolIconProps) {
        super(props);

        this.tooltipText = 'Eraser tool <b>(Shift + E)</b>';
    }

    render() {
        const toolName =  this.props.format === 'long' ? <ToolNameStyled>Delete</ToolNameStyled> : null;
    
        return (
            <ToolStyled ref={this.ref} {...this.props}>
                <ToolIconStyled viewBox="0 0 24 24">
                    <IconBackgroundComponent isActive={this.props.isActive} d="M0 0h24v24H0V0z"/>
                    <TrashHoleComponent isActive={this.props.isActive} opacity=".3" d="M8 9h8v10H8z"/>
                    <TrashComponent isActive={this.props.isActive} d="M15.5 4l-1-1h-5l-1 1H5v2h14V4zM6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9z"/>
                </ToolIconStyled>
                {toolName}
            </ToolStyled>
        );
    }
}