import * as React from 'react';
import styled from 'styled-components';
import { colors } from './colors';

const PropertyPanelStyled = styled.div`
    background: ${colors.backgroundGrey};
    width: 100%;
    height: 100%;
`;

export const PropertyPanel = () => {
    return (
        <PropertyPanelStyled></PropertyPanelStyled>
    )
}
