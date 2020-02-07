import styled from 'styled-components';

export const IconStyled = styled.svg`
    cursor: ${({disabled}: {disabled: boolean}) => disabled ? 'not-allowed' : 'pointer'};
`;

interface IconForgroundProps {
    color: string;
    disabled?: boolean;
}

export const IconForgroundStyled = styled.path`
    fill: ${({color}: IconForgroundProps) => color};
    fill-opacity: ${({disabled}: IconForgroundProps) => disabled ? 0.5 : 1};
    cursor: ${({disabled}: IconForgroundProps) => disabled ? 'not-allowed' : 'pointer'};
`;

export const IconBackgroundStyled = styled.path`
    fill: none;
`;

export interface IconProps {
    onClick: () => void;
    disabled?: boolean;
}