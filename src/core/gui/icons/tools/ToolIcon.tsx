import styled from "styled-components";
import { colors } from "../../styles";

export interface IconProps {
    isActive: boolean;
    onClick?(): void;
    format: 'short' | 'long';
    disabled?: boolean;
    color?: string;
}

export const ToolStyled = styled.div`
    display: flex;
    cursor: ${(props: IconProps) => props.disabled ? 'default' : 'pointer'};
    padding: ${(props: IconProps) => props.format === 'long' ? '3px' : '0px'};
    opacity: ${(props: IconProps) => props.disabled ? '0.4' : '1'};
    color: ${(props: IconProps) => props.color ? props.color : colors.textColor};

    &:hover {
        background: ${colors.hoverBackground};
    }
`;

export const ToolNameStyled = styled.div`
    padding-left: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

export const ToolIconStyled = styled.svg`
    width: 24px;
    height: 24px;
`;

export const ToolIconImageStyled = styled.path`
    fill: ${({isActive}: {isActive: boolean}) => isActive ? colors.grey3 : 'currentColor'};
`;

export const ToolIconBackgroundStyled = styled.path`
    fill: ${({isActive}: {isActive: boolean}) => isActive ? colors.active : colors.grey3};
`;