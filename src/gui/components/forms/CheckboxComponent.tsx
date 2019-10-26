import * as React from 'react';
import FormCheck from 'react-bootstrap/FormCheck';
import { withCommitOnChange } from './decorators/withCommitOnChange';

export interface CheckboxProps {
    isSelected: boolean;
    onChange(isSelected: boolean): void;
    onFocus(): void;
    onBlur(): void;
}

export function _CheckboxComponent(props: CheckboxProps) {
    return (
        <FormCheck
            custom
            type="checkbox"
            label={"is border?"}
            onClick={() => props.onChange(!props.isSelected)}
            checked={props.isSelected}
            onFocus={() => props.onFocus()}
            onBlur={() => props.onBlur()}
        />
    )
}

export const CheckboxComponent = withCommitOnChange(_CheckboxComponent);