import styled from "styled-components";
import { colors } from "../styles";

export const LabelStyled = styled.div`
    width: 70px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
`;

export const InputStyled = styled.div`
    width: calc(100% - 70px);
    max-width: 250px;
    overflow: hidden;
    display: inline-block;
`;

export const SettingsRowStyled = styled.div`
    padding: 3px 5px;
    border-bottom: 1px solid ${colors.panelBackgroundLight};
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;