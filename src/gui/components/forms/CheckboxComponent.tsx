import FormCheck from 'react-bootstrap/FormCheck';
import FormCheckInput from 'react-bootstrap/FormCheckInput';
import FormCheckLabel from 'react-bootstrap/FormCheckLabel';
import * as React from 'react';

export interface CheckboxProps {
    isSelected: boolean;
    onChange(isSelected: boolean): void;
}

export function CheckboxComponent(props: CheckboxProps) {
    return (
        <FormCheck custom type="checkbox" label={"is border?"} onClick={() => props.onChange(!props.isSelected)} checked={props.isSelected}/>
    )
}