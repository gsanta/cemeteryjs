import styled from "styled-components";
import { UI_ComponentProps } from "../../UI_ComponentProps";
import * as React from 'react';
import { colors } from "../../styles";
import { UI_PopupMultiSelect } from "../../../elements/UI_PopupMultiSelect";
import { MultiSelectFieldComp } from "./MultiSelectFieldComp";

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
        left: 50%;
        transform: translate(-50%, -50%);
        position: absolute;
        color: ${colors.textColor};
    }
`;

export function MultiSelectPopupComp(props: UI_ComponentProps<UI_PopupMultiSelect> ) {
    return props.element.paramController.isPopupOpen ? 
        (
            <PopupCompStyled onClick={e => e.stopPropagation()}>
                <div className="ce-popup-overlay" onClick={() => props.element.paramController.done()}></div>
                <div 
                    className='ce-popup'
                    style={{
                        width: props.element.popupWidth ? props.element.popupWidth : '500px',
                        height: props.element.popupHeight ? props.element.popupHeight : 'auto',
                    }}
                >
                    <MultiSelectFieldComp {...props}/>
                </div>        
            </PopupCompStyled>
        )
        : null;
}