

import * as React from 'react';
import styled from 'styled-components';
import { colors } from '../styles';
import { UI_Button } from '../../elements/UI_Button';

/* cursor: ${(props: Button_UI_Props) => props.disabled ? 'default' : 'pointer'};
opacity: ${(props: Button_UI_Props) => props.disabled ? '0.4' : '1'}; */
export const ButtonStyled = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;

    &.full-width {
        width: 100%;
    }

    &.normal-width {
        padding: 0px 5px;
    }

    border: 1px solid ${colors.grey3};
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

export const ButtonComp = (props: Button_UI_Props) => {
    const classes = `${props.element.width ? props.element.width : 'normal-width'}`;
    
    return (
        <ButtonStyled className={classes} {...props} onClick={() => props.element.click()}>
            
            <div className="button-label">
                {props.element.label}
            </div>
        </ButtonStyled>   
    )
}