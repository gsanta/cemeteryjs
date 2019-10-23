import FormCheck from 'react-bootstrap/FormCheck';
import FormCheckInput from 'react-bootstrap/FormCheckInput';
import FormCheckLabel from 'react-bootstrap/FormCheckLabel';
import * as React from 'react';

export interface CheckboxProps {
    isSelected: boolean;
}

export function CheckboxComponent(props: CheckboxProps) {

    return (
            <FormCheck type="switch">
            <FormCheckInput checked={props.isSelected} />
            <FormCheckLabel onClick={() => null}>
                is border
            </FormCheckLabel>
        </FormCheck>
    )
}