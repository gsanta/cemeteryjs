import * as React from 'react';
import styled from 'styled-components';
import { UI_Separator } from '../../../elements/surfaces/misc/UI_Separator';
import { colors } from '../../styles';
import { UI_ComponentProps } from '../../UI_ComponentProps';

export const SeparatorStyled = styled.div`
    width: 100%;
    height: 1px;
    margin: 10px 0px;
    border-top: 1px solid ${colors.grey3};
`

export function SeparatorComp(props: UI_ComponentProps<UI_Separator> ) {
    return <SeparatorStyled></SeparatorStyled>
}
