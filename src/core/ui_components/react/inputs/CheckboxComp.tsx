import Form from "react-bootstrap/Form";
import { UI_Checkbox } from "../../elements/UI_Checkbox";
import { UI_ComponentProps } from "../UI_ComponentProps";
import * as React from 'react';

export function CheckboxComp(props: UI_ComponentProps<UI_Checkbox>) {
    const checkboxComponent = (
        <Form.Check
            required
            name="terms"
            onChange={e => props.element.change(!props.element.val(props.registry), props.registry)}
            checked={props.element.val(props.registry)}
        />
    );

    if (props.element.label) {
        const style: React.CSSProperties = {
            display: 'flex',
            width: '100%'
        };
        
        if (props.element.layout === 'horizontal') {
            style.flexDirection = 'row';
            style.justifyContent = 'space-between';
            style.alignItems = 'center';
        } else {
            style.flexDirection = 'column';
        }

        return (
            <div style={style} className={`ce-labeled-input ${props.element.layout}`}>
                <div className="label">{props.element.label}</div>
                <div className="input">{checkboxComponent}</div>
            </div>
        )
    } else {
        return checkboxComponent;
    }
}