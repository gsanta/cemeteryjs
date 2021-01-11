import Form from "react-bootstrap/Form";
import { UI_Checkbox } from "../../elements/UI_Checkbox";
import { UI_ComponentProps } from "../UI_ComponentProps";
import * as React from 'react';

export function CheckboxComp(props: UI_ComponentProps<UI_Checkbox>) {
    const val = props.element.paramController.val();
    const checkboxComponent = (
        <Form.Check
            required
            name="terms"
            onChange={e => props.element.paramController.change(!val)}
            checked={val}
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
            <label style={style} className={`ce-labeled-input ${props.element.layout}`}>
                <div className="label">{props.element.label}</div>
                {checkboxComponent}
            </label>
        )
    } else {
        return checkboxComponent;
    }
}