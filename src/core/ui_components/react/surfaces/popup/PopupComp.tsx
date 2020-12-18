import styled from "styled-components";
import { UI_Popup } from "../../../elements/surfaces/UI_Popup";
import { UI_ContainerProps } from "../../UI_ComponentProps";
import * as React from 'react';
import { colors } from "../../styles";

const PopupCompStyled = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;

    .ce-popup-overlay {
        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        z-index: 1000;
        top: 0;
        left: 0;
        background-color: #435056;
        opacity: 0.5;
    }

    .ce-popup {
        display: flex;
        flex-direction: column;
        border-radius: 4px;
        background-color: ${colors.panelBackground};
        box-shadow: 0 4px 8px 0 rgba(0,0,0,0.14);
        padding: 15px;
        font-size: 16px;
        z-index: 1001;
        top: 50%;
        transform: translateY(-50%);
        left: 50%;
        transform: translate(-50%, 0);
        position: absolute;
        color: ${colors.textColor};
    }
`;

export function PopupComp(props: UI_ContainerProps<UI_Popup> ) {
    return (
        <PopupCompStyled onClick={e => e.stopPropagation()}>
            <div className="ce-popup-overlay" onClick={() => null}></div>
            <div 
                className='ce-popup'
                style={{
                    width: props.element.width ? props.element.width : '500px',
                    height: props.element.height ? props.element.height : 'auto',
                }}
            >
                {props.children}
            </div>        
        </PopupCompStyled>
    );
}