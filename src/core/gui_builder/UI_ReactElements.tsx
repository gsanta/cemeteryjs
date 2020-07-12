import styled from "styled-components";
import * as React from 'react';
import { InputComponent, ConnectedInputComponent } from "../gui/inputs/InputComponent";
import { UI_Row } from "./elements/UI_Row";
import { UI_TextField } from "./elements/UI_TextField";
import { LabeledField, LabelColumnStyled, FieldColumnStyled } from "../../plugins/scene_editor/settings/SettingsComponent";
import { MeshViewPropType } from "../../plugins/scene_editor/settings/MeshSettings";

export function cssClassBuilder(...classes: string[]) {
    return classes.filter(c => c).join(' ');
}

export interface RowProps {
    element: UI_Row;
    children?: JSX.Element | string | JSX.Element[];
}

const RowStyled = styled.div`
    display: flex;
    justify-content: space-between;
`;

export function RowGui(props: RowProps) {
    const classes = cssClassBuilder('ce-row', props.element.isBold ? 'ce-bold' : undefined);

    return (
        <RowStyled className={classes}>{props.children}</RowStyled>
    );
}

export function TextFieldGui(props: {element: UI_TextField}) {
    let textFieldComponent = (
        <InputComponent
            type="text"
            onBlur={() => props.element.blur()}
            onChange={val => props.element.change(val)}
            onFocus={() => props.element.focus()}
            value={props.element.val()}
        />
    );

    if (props.element.label) {
        return (
            <LabeledField>
                <LabelColumnStyled>{props.element.label}</LabelColumnStyled>
                <FieldColumnStyled>
                    {textFieldComponent}
                </FieldColumnStyled>
            </LabeledField>
        )
    } else {
        return textFieldComponent;
    }
}