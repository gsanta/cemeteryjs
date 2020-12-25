import * as React from 'react';
import styled from 'styled-components';
import { UI_PopupMultiSelect } from '../../../elements/UI_PopupMultiSelect';
import { colors } from '../../styles';
import { UI_ComponentProps } from '../../UI_ComponentProps';
import { Focusable } from "../Focusable";

export interface DropdownProps extends Focusable {
    values: string[];
    currentValue: string;
    onChange(newValue: string): void;
    placeholder: string;
    label?: string;
    clear?: () => void;
}

const MultiSelectStyled = styled.div`

    .dropdown-component {
        min-width: 100px;
        height: 25px;
        border-radius: 0;
        background: ${colors.grey3};
        color: ${colors.textColor};
        width: ${({inputWidth}: {inputWidth: string}) => inputWidth ? inputWidth : 'auto'}
    }
`;

export function MultiSelectFieldComp(props: UI_ComponentProps<UI_PopupMultiSelect>) {
    const values: string[] = props.element.paramController.values() || [];

    const options = values.map(val => {
        return <option key={val} value={val}>{val}</option>
    });
    const placeholder = <option key="placeholder" value="">{props.element.placeholder}</option>

    let select = (
        <select
            disabled={props.element.isDisabled}
            className="dropdown-component"
            onChange={(e) => props.element.paramController.select(e.target.value)}
            onMouseDown={(e) => e.stopPropagation()}
            onMouseUp={(e) => e.stopPropagation()}
            value={props.element.val(props.registry) ? props.element.val(props.registry) : ''}
        >
            {props.element.val(props.registry) ? options : [placeholder, ...options]}
        </select>
    );

    return props.element.label ? renderLabeledMultiSelect(props, select) : renderSimpleMultiSelect(props, select);
}

function renderLabeledMultiSelect(props: UI_ComponentProps<UI_PopupMultiSelect>, select: JSX.Element) {
    const style: React.CSSProperties = {
        display: 'flex',
        width: '100%'
    };
    
    style.flexDirection = 'row';
    style.justifyContent = 'space-between';
    style.alignItems = 'center';

    const selectedValues = props.element.paramController.selectedValues().map(val => <div>{val}</div>);

    return (
        <MultiSelectStyled inputWidth={props.element.inputWidth} style={style} className={`ce-labeled-input ${props.element.layout}`}>
            <div className="label">{props.element.label}</div>
            <div className="ce-input">
                {select}
                {selectedValues}
            </div>
        </MultiSelectStyled>
    )
}

function renderSimpleMultiSelect(props: UI_ComponentProps<UI_PopupMultiSelect>, select: JSX.Element) {
    const selectedValues = props.element.paramController.selectedValues().map(val => <div>{val}</div>);

    return (
        <MultiSelectStyled inputWidth={props.element.inputWidth}>
            <div className="ce-input">
                {select}
                {selectedValues}
            </div>
        </MultiSelectStyled>
    )
}

MultiSelectFieldComp.displayName = 'MultiSelectComp';