import * as React from 'react';
import styled from 'styled-components';

const SpinnerStyled = styled.div`
    &.sbl-dot-slide {
        height: 48px;
        width: 48px;
        color: #5a5a5a;
        display: inline-block;
        position: relative;
        border: 2px solid;
        animation: rotate-dot-panel 4s 0.5s cubic-bezier(0.25, 0.46, 0.61, 0.4) infinite;
    }

    &.sbl-dot-slide::before, &.sbl-dot-slide::after {
        content: '';
        position: absolute;
        color: inherit; 
    }
  
    &.sbl-dot-slide::before {
        height: 40%;
        width: 40%;
        border: inherit;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        margin: auto; 
    }

    &.sbl-dot-slide::after {
        height: 0;
        width: 0;
        border: 5px solid;
        border-radius: 50%;
        bottom: 0px;
        left: 0;
        margin: 1px;
        animation: move-dot 4s ease infinite; 
    }

    @keyframes rotate-dot-panel {
        0% {
            transform: rotate(0); 
        }
        25% {
            transform: rotate(90deg); 
        }
        50% {
            transform: rotate(180deg); 
        }
        75% {
            transform: rotate(270deg); 
        }
        100% {
            transform: rotate(360deg); 
        } 
    }

    @keyframes move-dot {
        0% {
            left: 0;
            top: 0; 
        }
        100% {
            left: 0;
            top: 0; 
        }
        25% {
            left: 0;
            top: 75%; 
        }
        50% {
            left: 75%;
            top: 75%; 
        }
        75% {
            left: 75%;
            top: 0%; 
        } 
    }
`;

export function SpinnerComponent() {
    return (
        <SpinnerStyled className="sbl-dot-slide" style={{width: '50px', height: '50px'}}></SpinnerStyled>
    )
}