import styled from 'styled-components';

export type IconState = 'default' | 'active' | 'disabled';

export const IconStyled = styled.svg`
    cursor: ${(props: IconProps) => props.state === 'disabled' ? 'not-allowed' : 'pointer'};
    width: ${(props: IconProps) => props.width ? props.width : '12px'};
    height: ${(props: IconProps) => props.height ? props.height : '12px'};
`;

export const IconForgroundStyled = styled.path`
    fill: ${(props: IconProps) => props.state === 'active' ? 'green' : props.color};
    fill-opacity: ${(props: IconProps) => props.state === 'disabled' ? 0.5 : 1};
    cursor: ${(props: IconProps) => props.state === 'disabled' ? 'not-allowed' : 'pointer'};
`;

export const IconBackgroundStyled = styled.path`
    fill: none;
`;

export interface IconProps {
    onClick?: () => void;
    state?: IconState;
    width?: string;
    height?: string;
    color?: string;
}