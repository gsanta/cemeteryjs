import React from "react";
import { UI_PopupTriggerButton } from "../../elements/UI_PopupTriggerButton";
import { UI_ComponentProps } from "../UI_ComponentProps";


export const PopupTriggerButtonComp = (props: UI_ComponentProps<UI_PopupTriggerButton>) => {
    const style: React.CSSProperties = {}
    const onClick = () => {
        
    }
    
    return (
        <div className="ce-multi-select-button" style={style} {...props} onClick={() => props.element.click(props.registry)}>
            {props.element.label}
        </div>   
    )
}