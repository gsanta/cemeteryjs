import * as React from 'react';
import Slider, { Handle } from 'rc-slider';
import { Focusable } from './Focusable';
import { withCommitOnChange } from './withCommitOnChange';

export interface SliderProps extends Focusable {
    value: number;
    onChange(newValue: number): void;
    min: number;
    max: number;
}

const handle = (props) => {
    const { value, ...restProps } = props;
    return (
        <Handle value={value} {...restProps} />
    );
};

export class SliderComponent extends React.Component<SliderProps> {

    render() {
        return (
            <Slider min={this.props.min} max={this.props.max} value={this.props.value} onChange={this.props.onChange} handle={handle} />
        );
    }
}

export const ConnectedSliderComponent = withCommitOnChange<SliderProps>(SliderComponent);
