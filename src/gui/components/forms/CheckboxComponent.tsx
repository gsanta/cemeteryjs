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
        <FormCheck type="switch">
            <FormCheckInput checked={props.isSelected} />
            <FormCheckLabel onClick={() => props.onChange(!props.isSelected)}>
                Is border?
            </FormCheckLabel>
        </FormCheck>
    )
}