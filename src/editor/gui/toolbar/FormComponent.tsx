import styled from "styled-components";
import { colors } from "../styles";

export const LabelStyled = styled.div`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    font-size: 12px;
`;

export const InputStyled = styled.div`
    width: calc(100% - 70px);
    max-width: 250px;
    overflow: hidden;
    display: inline-block;
`;

export interface SettingsRowProps {
    verticalAlign?: 'center' | 'right' | 'space' 
} 

export const SettingsRowStyled = styled.div`
    padding: 3px 5px;
    border-bottom: 1px solid ${colors.panelBackgroundLight};
    display: flex;
    flex-direction: row;
    justify-content: ${(props: SettingsRowProps) => props.verticalAlign === 'center' ? 'center' : props.verticalAlign === 'right' ? 'flex-end' : 'space-between'};
    align-items: center;

    &:last-child {
        border-bottom: none;
    }

    > div:first-child {
        margin-right:  ${(props: SettingsRowProps) => props.verticalAlign ? '10px' : '0px'}
    }
`;