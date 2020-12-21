import React from "react";
import styled from "styled-components";
import { UI_PopupMultiSelect } from "../../../elements/UI_PopupMultiSelect";
import { colors } from "../../styles";
import { UI_ComponentProps } from "../../UI_ComponentProps";

const MultiSelectTriggerStyled = styled.div`
    &.ce-labeled-input {
        display: flex;
        width: 100%;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;    
    }

    .input {
        min-width: 120px;
        background: ${colors.grey3};
        color: ${colors.textColor};
        height: 100%;
        padding: 0 5px;
        overflow-y: auto;
    }
`;


export const MultiSelectTriggerComp = (props: UI_ComponentProps<UI_PopupMultiSelect>) => {
    let classNames = undefined;

    if (props.element.label) {
        classNames = `ce-labeled-input ${props.element.layout}`;
    }
    const selectedValues = props.element.paramController.selectedValues(props.element);

    const selectedValueComps = selectedValues.length > 0 ? selectedValues.map(val => <div>{val}</div>) : 'Select meshes...';
    const buttonComp = <div className="input"  onClick={() => props.element.paramController.open()}>{selectedValueComps}</div>;
    const labelComp = props.element.label ? <div className="label">{props.element.label}</div> : null;

    return <MultiSelectTriggerStyled className={classNames}>{labelComp}{buttonComp}</MultiSelectTriggerStyled>;
}