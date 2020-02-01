import styled from "styled-components";
import { colors } from "../styles";

export interface IconProps {
    isActive: boolean;
    onClick(): void;
}

export const ToolStyled = styled.div`
    padding: 3px;
    display: flex;
    cursor: pointer;

    &:hover {
        background: ${colors.hoverBackground};
    }
`;

export const ToolNameStyled = styled.div`
    padding-left: 5px;
    color: ${colors.textColor};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

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