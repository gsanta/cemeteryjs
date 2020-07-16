import * as React from 'react';
import { UI_TextField } from '../../gui_builder/elements/UI_TextField';
import { InputComponent } from './InputComponent';
import { LabeledInputComp } from './LabeledInputComp';

export function TextFieldComp(props: {element: UI_TextField}) {
    let textFieldComponent = (
        <InputComponent
            type={props.element.type}
            onBlur={() => props.element.blur()}
            onChange={val => props.element.change(val)}
            onFocus={() => props.element.focus()}
            value={props.element.val()}
        />
    );

    if (props.element.label) {
        return (
            <LabeledInputComp label={props.element.label} direction="horizontal">
                {textFieldComponent}
            </LabeledInputComp>
        )
    } else {
        return textFieldComponent;
    }
}