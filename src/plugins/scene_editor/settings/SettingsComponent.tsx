import styled from "styled-components";

export const LabelColumnStyled = styled.div`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    font-size: 12px;
`;

export const FieldColumnStyled = styled.div`
    overflow: hidden;
    display: flex;
    justify-content: space-between;
    align-items: center;
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

export const LabeledField = styled.div`
    padding: 1px 1px;
    display: flex;
    flex-direction: row;
    justify-content: ${(props: SettingsRowProps) => props.verticalAlign === 'center' ? 'center' : props.verticalAlign === 'right' ? 'flex-end' : 'space-between'};
    align-items: center;

    &:last-child {
        border-bottom: none;
    }

    > div:first-child {
        margin-right:  ${(props: SettingsRowProps) => props.verticalAlign ? '10px' : '0px'};
    }

    > div:last-child {
        width: calc(100% - 70px);
        max-width: 250px;
    }
`;

export const VerticalLabeledField = styled.div`
    display: flex;
    flex-direction: column;
`;