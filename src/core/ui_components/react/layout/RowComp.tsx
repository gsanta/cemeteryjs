import * as React from 'react';
import styled from "styled-components";
import { UI_Row } from "../../elements/UI_Row";

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
    /* margin-top: 4px; */

    &.ce-v_align-center {
        align-items: center;
    }
`;

export function RowComp(props: RowProps) {
    const classes = cssClassBuilder(
        'ce-row',
        props.element.isBold ? 'ce-bold' : undefined,
        props.element.vAlign ? `ce-v_align-${props.element.vAlign}` : 'ce-v_align-start'
    );

    const style: React.CSSProperties = {};

    props.element.padding && (style.padding = props.element.padding);
    props.element.margin && (style.margin = props.element.margin);
    props.element.backgroundColor && (style.backgroundColor = props.element.backgroundColor);
    props.element.hAlign && (style.justifyContent = props.element.hAlign);
    props.element.height && (style.height = props.element.height);

    return (
        <RowStyled style={style} className={classes}>{props.children}</RowStyled>
    );
}

RowComp.displayName = 'RowComp';