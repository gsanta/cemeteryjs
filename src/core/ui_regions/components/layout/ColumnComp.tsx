import * as React from 'react';
import styled from "styled-components";
import { UI_ContainerProps } from '../UI_ComponentProps';
import { UI_Column } from '../../elements/UI_Column';
import { cssClassBuilder } from './RowComp';

const ColumntStyled = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 4px;
    flex-direction: column;

    &.ce-h_align-center {
        align-items: center;
    }
`;

export function ColumnComp(props: UI_ContainerProps<UI_Column>) {
    const classes = cssClassBuilder(
        'ce-column',
        props.element.isBold ? 'ce-bold' : undefined,
        props.element.vAlign ? `ce-h_align-${props.element.vAlign}` : 'ce-h_align-start' 
    );

    const style: React.CSSProperties = {};

    props.element.padding && (style.padding = props.element.padding);
    props.element.margin && (style.margin = props.element.margin);
    props.element.backgroundColor && (style.backgroundColor = props.element.backgroundColor);
    props.element.hAlign && (style.justifyContent = props.element.hAlign);

    return (
        <ColumntStyled style={style} className={classes}>{props.children}</ColumntStyled>
    );
}

ColumnComp.displayName = 'ColumnComp';