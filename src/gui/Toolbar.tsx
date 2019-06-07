import * as React from 'react';
import styled from 'styled-components';
import { colors } from './colors';
import { PointerIcon } from './toolbar/PointerIcon';
import { ToolbarItem } from './toolbar/ToolbarItem';
import { RectangleShapeIcon } from './toolbar/RectangleShapeIcon';

const ToolbarStyled = styled.div`
    background: ${colors.backgroundGrey};
    width: 100%;
    height: 100%;
`;

export const Toolbar = () => {
    return (
        <ToolbarStyled>
            <ToolbarItem><PointerIcon/></ToolbarItem>
            <ToolbarItem><RectangleShapeIcon/></ToolbarItem>
        </ToolbarStyled>
    )
}

