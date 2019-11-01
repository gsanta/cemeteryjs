import styled from "styled-components";

export interface IconProps {
    isActive: boolean;
    onClick(): void;
}

export const IconComponent = styled.svg`
    width: 24px;
    height: 24px;
    cursor: pointer;
    margin-right: 10px;
`;