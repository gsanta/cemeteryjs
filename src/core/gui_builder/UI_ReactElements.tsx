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
    margin-top: 4px;

    &.align-center {
        justify-content: center;
    }
`;

export function RowGui(props: RowProps) {
    const classes = cssClassBuilder(
        'ce-row',
        props.element.isBold ? 'ce-bold' : undefined,
        props.element.align ? `align-${props.element.align}` : 'align-left' 
    );

    return (
        <RowStyled className={classes}>{props.children}</RowStyled>
    );
}