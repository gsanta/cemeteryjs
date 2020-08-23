import * as React from 'react';
import styled from 'styled-components';
import { UI_Select } from '../../elements/UI_Select';
import { ClearIconComponent } from '../icons/ClearIconComponent';
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

const SelectStyled = styled.div`
    display: flex;
    justify-content: space-between;
`;

const LabelStyled = styled.div`
    font-size: 12px;
`;

export function SelectComp(props: UI_ComponentProps<UI_Select>) {
    const values: string[] = props.element.values() || [];

    const options = values.map(val => {
        return <option key={val} value={val}>{val}</option>
    });
    const placeholder = <option key="placeholder" value="">{props.element.placeholder}</option>

    const selectStyle: React.CSSProperties = {
        minWidth: '100px',
        height: '25px',
        borderRadius: 0
    };

    props.element.inputWidth && (selectStyle.width = props.element.inputWidth);

    let select = (
        <select
            className="dropdown-component"
            style={selectStyle}
            onChange={(e) => {
                props.element.change(e.target.value);
            }}
            onMouseDown={(e) => {
                e.stopPropagation();
            }}
            onMouseUp={(e) => {
                e.stopPropagation();
            }}
            value={props.element.val() ? props.element.val() : ''}
        >
            {props.element.val() ? options : [placeholder, ...options]}
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
            <div style={style} className={`labeled-input ${props.element.layout}`}>
                <div className="label">{props.element.label}</div>
                <div className="input">
                    {select}
                    {props.element.clearable && props.element.val() ? <ClearIconComponent onClick={() => props.element.change(undefined)}/> : null}
                </div>
            </div>
        )
    }

    return select;
}

SelectComp.displayName = 'SelectComp';