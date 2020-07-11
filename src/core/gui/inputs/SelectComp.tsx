import * as React from 'react';
import styled from 'styled-components';
import { UI_Select } from '../../gui_builder/elements/UI_Select';
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
    height: 30px;
    display: flex;
    justify-content: space-between;
`;

const LabeledSelectStyled = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

const LabelStyled = styled.div`
    font-size: 12px;
`;

export const SelectComp = (props: UI_ComponentProps<UI_Select>) => {
    const values: string[] = props.element.listVal();

    const options = values.map(val => {
        return <option key={val} value={val}>{val}</option>
    });
    const placeholder = <option key="placeholder" value="">{props.element.placeholder}</option>

    let select = (
        <select
            className="dropdown-component"
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
        select = (
            <LabeledSelectStyled>
                <LabelStyled>{props.element.label}</LabelStyled>
                <SelectStyled>
                    {select}
                    {props.element.val() ? <ClearIconComponent onClick={() => props.element.change(undefined)}/> : null}
                </SelectStyled>
            </LabeledSelectStyled>
        )
    }

    return select;
}