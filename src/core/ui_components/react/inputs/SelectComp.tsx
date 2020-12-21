import * as React from 'react';
import styled from 'styled-components';
import { UI_Select } from '../../elements/UI_Select';
import { ClearIconComponent } from '../icons/ClearIconComponent';
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

export function SelectComp(props: UI_ComponentProps<UI_Select>) {
    const values: string[] = props.element.paramController.values(null, null) || [];

    const options = values.map(val => {
        return <option key={val} value={val}>{val}</option>
    });
    const placeholder = <option key="placeholder" value="">{props.element.placeholder}</option>

    const selectStyle: React.CSSProperties = {
        minWidth: '100px',
        height: '25px',
        borderRadius: 0,
        background: colors.grey3,
        color: colors.textColor
    };

    props.element.inputWidth && (selectStyle.width = props.element.inputWidth);

    const val = props.element.paramController.val();

    let select = (
        <select
            disabled={props.element.isDisabled}
            className="dropdown-component"
            style={selectStyle}
            onChange={(e) => {
                props.element.paramController.change(e.target.value, null, null);
            }}
            onMouseDown={(e) => {
                e.stopPropagation();
            }}
            onMouseUp={(e) => {
                e.stopPropagation();
            }}
            value={val ? val : ''}
        >
            {val ? options : [placeholder, ...options]}
        </select>
    );

    if (props.element.label) {
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

        select = (
            <div style={style} className={`ce-labeled-input ${props.element.layout}`}>
                <div className="label">{props.element.label}</div>
                <div className="input">
                    {select}
                    {props.element.clearable && val ? <ClearIconComponent onClick={() => props.element.paramController.change(undefined, null, null)}/> : null}
                </div>
            </div>
        )
    }

    return select;
}

SelectComp.displayName = 'SelectComp';