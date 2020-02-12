import styled from "styled-components";
import { colors } from "../../styles";

export interface IconProps {
    isActive: boolean;
    onClick(): void;
    format: 'short' | 'long';
}

export const ToolStyled = styled.div`
    display: flex;
    cursor: pointer;
    padding: ${(props: IconProps) => props.format === 'long' ? '3px' : '0px'};

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

export const ToolIconStyled = styled.svg`
    width: 24px;
    height: 24px;
    cursor: pointer;
`;

export const ToolIconImageStyled = styled.path`
    fill: ${({isActive}: {isActive: boolean}) => isActive ? colors.grey3 : colors.textColor};
`;

export const ToolIconBackgroundStyled = styled.path`
    fill: ${({isActive}: {isActive: boolean}) => isActive ? colors.active : colors.grey3};
`;