import * as React from 'react';
import styled from "styled-components";
import { UI_Box } from "../../ui_regions/elements/UI_Box";
import { UI_ContainerProps } from '../UI_ComponentProps';

export function cssClassBuilder(...classes: string[]) {
    return classes.filter(c => c).join(' ');
}

const BoxStyled = styled.div`

    &.ce-box {

    }
`;

export function BoxComp(props: UI_ContainerProps<UI_Box>) {
    const classes = cssClassBuilder(
        'ce-box'
    );

    return (
        <BoxStyled className={classes}>{props.children}</BoxStyled>
    );
}