import styled from "styled-components";
import * as React from 'react';
import { UI_TextField, UI_Row } from "./UI_Element";
import { InputComponent } from "../gui/inputs/InputComponent";

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
        <RowStyled className={classes}></RowStyled>
    );
}

export function TextFieldGui(props: {element: UI_TextField}) {
    const classes = cssClassBuilder('ce-row', props.element.isBold ? 'ce-bold' : undefined);

    return (
        <InputComponent
            type="text"
            onBlur={() => props.element.blur()}
            onFocus={() => props.element.focus()}
            onChange={val => props.element.setVal(val)}
            value={props.element.getVal()}
        />
    );
}

// const AssetRowHeaderStyled = styled.div`
//     display: flex;
//     justify-content: space-between;
//     font-weight: bold;
//     margin: 10px 0 5px 0;
// `;