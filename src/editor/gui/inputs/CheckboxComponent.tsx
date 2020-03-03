import * as React from 'react';
import FormCheck from 'react-bootstrap/FormCheck';
import './CheckboxComponent.scss';
import { withCommitOnChange } from '../forms/decorators/withCommitOnChange';

export interface CheckboxProps {
    isSelected: boolean;
    onChange(isSelected: boolean): void;
}

export function CheckboxComponent(props: CheckboxProps) {
    return (
        <div className="checkbox">
            <input type="checkbox" checked={props.isSelected} onChange={() => props.onChange(!props.isSelected)}/>
            {/* <div className="label">is border?</div>
            <FormCheck
                checked={props.isSelected}
                className="form-check"
                type='checkbox'
                onChange={() => props.onChange(!props.isSelected)}
                onFocus={() => props.onFocus()}
                onBlur={() => props.onBlur()}
            /> */}
        </div>
    )
}

// export const CheckboxComponent = withCommitOnChange(_CheckboxComponent);