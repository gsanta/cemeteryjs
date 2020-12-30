import * as React from 'react';
import styled from 'styled-components';
import { UI_Separator } from '../../../elements/surfaces/misc/UI_Separator';
import { colors } from '../../styles';
import { UI_ComponentProps } from '../../UI_ComponentProps';

export const SeparatorStyled = styled.div`
    color: ${colors.textColor};
    display: flex;
    align-items: center;
    margin: 10px 0;


    .ce-separator-border {
        border-bottom: 1px solid ${colors.grey3};
        width: 100%;
    }

    .ce-separator-content {
        padding: 0 10px 0 10px;
        font-style: italic;
        opacity: 0.7;
        white-space: nowrap;
    }
`
    /* width: 100%;
    height: 1px;
    margin: 10px 0px;
    border-top: 1px solid ${colors.grey3}; */
export function SeparatorComp(props: UI_ComponentProps<UI_Separator> ) {
    const { text } = props.element;

    const content = text ? <span className="ce-separator-content">{text}</span> : null;
    return (
        <SeparatorStyled>
            <div className="ce-separator-border" />
            {content}
            <div className="ce-separator-border" />
        </SeparatorStyled>
    )
}