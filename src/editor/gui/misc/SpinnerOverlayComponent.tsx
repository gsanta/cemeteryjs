import * as React from 'react';
import { SpinnerComponent } from './SpinnerComponent';
import styled from 'styled-components';

const SpinnerOverlayStyled = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: grey;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0.7;
    z-index: 1000;
`;

export function SpinnerOverlayComponent() {

    return (
        <SpinnerOverlayStyled>
            <SpinnerComponent/>
        </SpinnerOverlayStyled>
    )
}