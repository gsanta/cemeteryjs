import styled from 'styled-components';

export const IconStyled = styled.svg`
    cursor: pointer;
`;

export const IconForegroundStyled = styled.path`
    fill: ${({color}: {color: string}) => color};
`;

export const IconBackgroundStyled = styled.path`
    fill: none;
`;
