import styled from 'styled-components';

type IconState = 'default' | 'active' | 'disabled';

export const IconStyled = styled.svg`
    cursor: ${({state}: {state?: IconState}) => state === 'disabled' ? 'not-allowed' : 'pointer'};
`;

interface IconForgroundProps {
    color: string;
    state?: IconState;
}

export const IconForgroundStyled = styled.path`
    fill: ${({color, state}: IconForgroundProps) => state === 'active' ? 'green' : color};
    fill-opacity: ${({state}: IconForgroundProps) => state === 'disabled' ? 0.5 : 1};
    cursor: ${({state}: IconForgroundProps) => state === 'disabled' ? 'not-allowed' : 'pointer'};
`;

export const IconBackgroundStyled = styled.path`
    fill: none;
`;

export interface IconProps {
    onClick: () => void;
    state?: IconState;
}