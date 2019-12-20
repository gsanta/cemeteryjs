import * as React from 'react';
import FormCheck from 'react-bootstrap/FormCheck';
import './CheckboxComponent.scss';
import { withCommitOnChange } from './decorators/withCommitOnChange';

export interface CheckboxProps {
    isSelected: boolean;
    onChange(isSelected: boolean): void;
    onFocus(): void;
    onBlur(): void;
}

export function _CheckboxComponent(props: CheckboxProps) {
    return (
        <div className="checkbox">
            <div className="label">is border?</div>
            <FormCheck
                checked={props.isSelected}
                className="form-check"
                type='checkbox'
                onChange={() => props.onChange(!props.isSelected)}
                onFocus={() => props.onFocus()}
                onBlur={() => props.onBlur()}
            />
        </div>
    )
}

export const CheckboxComponent = withCommitOnChange(_CheckboxComponent);