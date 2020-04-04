import styled from "styled-components";
import { colors } from "../../../../gui/styles";

export const LabelColumnStyled = styled.div`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    font-size: 12px;
`;

export const FieldColumnStyled = styled.div`
    width: calc(100% - 70px);
    max-width: 250px;
    overflow: hidden;
    display: inline-block;
`;

export const MultiFieldColumnStyled = styled.div`
    width: calc(100% - 70px);
    max-width: 250px;
    overflow: hidden;
    display: flex;
`;

export interface SettingsRowProps {
    verticalAlign?: 'center' | 'right' | 'space' 
}

export const GroupedRowsStyled = styled.div`
    margin-bottom: 5px;
`;

export const SettingsRowStyled = styled.div`
    padding: 1px 1px;
    /* border-bottom: 1px solid ${colors.panelBackgroundLight}; */
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