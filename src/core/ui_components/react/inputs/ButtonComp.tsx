

import * as React from 'react';
import styled from 'styled-components';
import { colors } from '../styles';
import { UI_Button } from '../../elements/UI_Button';
import { UI_ComponentProps } from '../UI_ComponentProps';

/* cursor: ${(props: Button_UI_Props) => props.disabled ? 'default' : 'pointer'};
opacity: ${(props: Button_UI_Props) => props.disabled ? '0.4' : '1'}; */
export const ButtonStyled = styled.a`
    display: inline-block;
    border-radius: 0.15em;
    padding: 0 5px 4px 5px;
    box-sizing: border-box;
    text-decoration: none;
    font-weight: 400;
    color: ${colors.textColor};
    background-color: ${colors.grey3};
    box-shadow: inset 0 -0.6em 0 -0.35em rgba(0,0,0,0.17);
    text-align: center;
    position: relative;
    cursor: pointer;
    height: 25px;
`;

export const ButtonComp = (props: UI_ComponentProps<UI_Button>) => {
    const style: React.CSSProperties = {}
    props.element.width && (style.width = props.element.width);
    
    return (
        <ButtonStyled className="ce-button" style={style} {...props} onClick={() => props.element.paramController.click()}>
            {props.element.label}
            
            {/* <div className="button-label" style={{width: props.element.width ? props.element.width : 'auto'}}>
            </div> */}
        </ButtonStyled>   
    )
}