import * as React from 'react';
import styled from "styled-components";
import { UI_Row } from "../../gui_builder/elements/UI_Row";

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

export function RowComp(props: RowProps) {
    const classes = cssClassBuilder(
        'ce-row',
        props.element.isBold ? 'ce-bold' : undefined,
        props.element.align ? `align-${props.element.align}` : 'align-left' 
    );

    return (
        <RowStyled className={classes}>{props.children}</RowStyled>
    );
}