import styled from "styled-components";
import { colors } from "../../../../core/ui_regions/components/styles";
import { IconState } from "../../../../core/ui_regions/components/icons/Icon";

export interface ToolIconProps {
    onClick?(): void;
    isActive?: boolean;
    format?: 'short' | 'long';
    disabled?: boolean;
    color?: string;
    tooltipText?: string;
    state?: IconState;
}

export const ToolStyled = styled.div`
    display: flex;
    cursor: ${(props: ToolIconProps) => props.disabled ? 'default' : 'pointer'};
    padding: ${(props: ToolIconProps) => props.format === 'long' ? '3px' : '0px'};
    opacity: ${(props: ToolIconProps) => props.disabled ? '0.4' : '1'};
    color: ${(props: ToolIconProps) => props.color ? props.color : colors.textColor};

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