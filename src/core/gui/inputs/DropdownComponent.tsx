import * as React from 'react';
import { withCommitOnChange } from './withCommitOnChange';
import './DropdownComponent.scss';
import { Focusable } from "./Focusable";
import styled from 'styled-components';
import { ClearIconComponent } from '../icons/ClearIconComponent';

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

export const DropdownComponent : React.SFC<DropdownProps> = (props: DropdownProps) => {
    const options = props.values.map(val => {
        return <option value={val}>{val}</option>
    });
    const placeholder = <option value="">{props.placeholder}</option>

    let select = (
        <select
            className="dropdown-component"
            onChange={(e) => {
                props.onChange(e.target.value);
            }}
            value={props.currentValue ? props.currentValue : ''}
        >
                {props.currentValue ? options : [placeholder, ...options]}
        </select>
    );

    if (props.label) {
        select = (
            <LabeledSelectStyled>
                <LabelStyled>{props.label}</LabelStyled>
                <SelectStyled>
                    {select}
                    {props.currentValue ? <ClearIconComponent onClick={() => props.clear()}/> : null}
                </SelectStyled>
            </LabeledSelectStyled>
        )
    }

    return select;
}

DropdownComponent.defaultProps = {
    onFocus: () => null,
    onBlur: () => null
};

export const ConnectedDropdownComponent = withCommitOnChange<DropdownProps>(DropdownComponent);