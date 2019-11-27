import Dropdown from "react-bootstrap/Dropdown";
import DropdownMenu from "react-bootstrap/DropdownMenu";
import DropdownItem from "react-bootstrap/DropdownItem";
import DropdownToggle from "react-bootstrap/DropdownToggle";
import * as React from 'react'
import './DropdownComponent.scss';
import { withCommitOnChange } from './decorators/withCommitOnChange';
import { Focusable } from "./Focusable";
import styled from 'styled-components';
import { colors } from "../styles";

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

export function DropdownComponent(props: DropdownProps) {
    const placeholder = <span>Select...</span>
    const options = props.values.map(char => <DropdownItemStyled eventKey={char}>{char}</DropdownItemStyled>)

    return (
        <Dropdown 
            className="dropdown-component"
            onSelect={e => props.onChange(e)}
            onFocus={() => props.onFocus()}
            onBlur={() => props.onBlur()}
        >
            <DropdownToggleStyled id="dropdown-basic">
                {props.currentValue ? props.currentValue : placeholder}
            </DropdownToggleStyled>
            <DropdownMenuStyled onSelect={e => props.onChange(e)}>
                {options}
            </DropdownMenuStyled>
        </Dropdown>
    );
}
export const ConnectedDropdownComponent = withCommitOnChange<DropdownProps>(DropdownComponent);