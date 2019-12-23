import styled from "styled-components";
import { colors } from "../styles";

export interface IconProps {
    isActive: boolean;
    onClick(): void;
}

export const IconStyled = styled.svg`
    width: 24px;
    height: 24px;
    cursor: pointer;
`;

export const IconImageStyled = styled.path`
    fill: ${({isActive}: {isActive: boolean}) => isActive ? colors.grey3 : colors.textColor};
`;

export const IconBackgroundStyled = styled.path`
    fill: ${({isActive}: {isActive: boolean}) => isActive ? colors.active : colors.grey3};
`;