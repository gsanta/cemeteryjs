import Dropdown from "react-bootstrap/Dropdown";
import DropdownMenu from "react-bootstrap/DropdownMenu";
import DropdownItem from "react-bootstrap/DropdownItem";
import DropdownToggle from "react-bootstrap/DropdownToggle";
import * as React from 'react'
import './DropdownComponent.scss';
import { Focusable } from "./Focusable";
import styled from 'styled-components';
import { colors } from "../styles";
import { withCommitOnChange } from './decorators/withCommitOnChange';

export interface DropdownProps extends Focusable {
    values: string[];
    currentValue: string;
    onChange(newValue: string): void;
}

const DropdownToggleStyled = styled(DropdownToggle)`
    background: ${colors.active} !important;
    box-shadow: none !important;
    color: ${colors.textColorDark} !important;
    border: ${`1px solid ${colors.grey4}`};
    height: 30px;
    padding: 0px 10px;
`;

const DropdownMenuStyled = styled(DropdownMenu)`
    border-radius: 0;
    border: ${`1px solid ${colors.grey4}`};
`;

const DropdownItemStyled = styled(DropdownItem)`
    &:hover {
        background: ${colors.grey5};
    }
`;

export const DropdownComponent : React.SFC<DropdownProps> = (props: DropdownProps) => {
    const placeholder = <span>Select...</span>
    const options = props.values.map(char => <option value={char}>{char}</option>)

    return (
        <select 
            className="dropdown-component"
            onChange={(e) => {
                props.onFocus();
                props.onChange(e.target.value);
                props.onBlur();
            }}
            // onFocus={() => props.onFocus()}
        >
                {options}
        </select>
    );
}

DropdownComponent.defaultProps = {
    onFocus: () => null,
    onBlur: () => null
};

export const ConnectedDropdownComponent = withCommitOnChange<DropdownProps>(DropdownComponent);