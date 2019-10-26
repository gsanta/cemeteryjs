import * as React from 'react';
import FormCheck from 'react-bootstrap/FormCheck';
import FormCheckInput from 'react-bootstrap/FormCheckInput';
import FormCheckLabel from 'react-bootstrap/FormCheckInput';
import { withCommitOnChange } from './decorators/withCommitOnChange';
import FormControl from 'react-bootstrap/FormControl';

export interface CheckboxProps {
    isSelected: boolean;
    onChange(isSelected: boolean): void;
    onFocus(): void;
    onBlur(): void;
}

export function _CheckboxComponent(props: CheckboxProps) {
    return (
        <div className="checkbox">
            <FormCheck
                className="form-check"
                type='checkbox'
                label={props.isSelected}
                onChange={() => console.log('select')}
            />
            is selected?
        </div>
    )
}

export const CheckboxComponent = withCommitOnChange(_CheckboxComponent);