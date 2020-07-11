import styled from "styled-components";
import * as React from 'react';
import { InputComponent } from "../gui/inputs/InputComponent";
import { UI_Row } from "./elements/UI_Row";
import { UI_TextField } from "./elements/UI_TextField";

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
    const classes = cssClassBuilder('ce-row', props.element.isBold ? 'ce-bold' : undefined);

    return (
        <InputComponent
            type="text"
            onBlur={() => props.element.blur()}
            onChange={val => props.element.change(val)}
            value={props.element.val()}
        />
    );
}

// const AssetRowHeaderStyled = styled.div`
//     display: flex;
//     justify-content: space-between;
//     font-weight: bold;
//     margin: 10px 0 5px 0;
// `;