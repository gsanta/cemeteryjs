import * as React from 'react';
import styled from 'styled-components';
import { UI_MultiSelect } from '../../elements/UI_MultiSelect';
import { colors } from '../styles';
import { UI_ComponentProps } from '../UI_ComponentProps';
import './DropdownComponent.scss';
import { Focusable } from "./Focusable";

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
        minWidth: 100px;
        height: 25px;
        borderRadius: 0;
        background: ${colors.grey3};
        color: ${colors.textColor};
        width: ${({inputWidth}: {inputWidth: string}) => inputWidth ? inputWidth : 'auto'}
    }
`;

export function MultiSelectComp(props: UI_ComponentProps<UI_MultiSelect>) {
    const values: string[] = props.element.values(props.registry) || [];

    const options = values.map(val => {
        return <option key={val} value={val}>{val}</option>
    });
    const placeholder = <option key="placeholder" value="">{props.element.placeholder}</option>

    let select = (
        <select
            disabled={props.element.isDisabled}
            className="dropdown-component"
            onChange={(e) => {
                props.element.change(e.target.value, props.registry);
            }}
            onMouseDown={(e) => {
                e.stopPropagation();
            }}
            onMouseUp={(e) => {
                e.stopPropagation();
            }}
            value={props.element.val(props.registry) ? props.element.val(props.registry) : ''}
        >
            {props.element.val(props.registry) ? options : [placeholder, ...options]}
        </select>
    );

    return props.element.label ? renderLabeledMultiSelect(props, select) : renderSimpleMultiSelect(props, select);
}

function renderLabeledMultiSelect(props: UI_ComponentProps<UI_MultiSelect>, select: JSX.Element) {
    const style: React.CSSProperties = {
        display: 'flex',
        width: '100%'
    };
    
    if (props.element.layout === 'horizontal') {
        style.flexDirection = 'row';
        style.justifyContent = 'space-between';
        style.alignItems = 'center';
    } else {
        style.flexDirection = 'column';
    }

    const selectedValues = props.element.selectedValues().map(val => <div>{val}</div>) 

    return (
        <MultiSelectStyled inputWidth={props.element.inputWidth} style={style} className={`labeled-input ${props.element.layout}`}>
            <div className="label">{props.element.label}</div>
            <div className="ce-input">
                {select}
                {selectedValues}
            </div>
        </MultiSelectStyled>
    )
}

function renderSimpleMultiSelect(props: UI_ComponentProps<UI_MultiSelect>, select: JSX.Element) {
    const selectedValues = props.element.selectedValues().map(val => <div>{val}</div>) 

    return (
        <MultiSelectStyled inputWidth={props.element.inputWidth}>
            <div className="label">{props.element.label}</div>
            <div className="ce-input">
                {select}
                {selectedValues}
            </div>
        </MultiSelectStyled>
    )
}

MultiSelectComp.displayName = 'MultiSelectComp';