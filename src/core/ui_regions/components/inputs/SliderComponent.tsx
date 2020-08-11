import * as React from 'react';
import Slider, { Handle } from 'rc-slider';
import { Focusable } from './Focusable';
import { withCommitOnChange } from './withCommitOnChange';

//TODO something is wrong with Slider, Handle ts delaration causing compile error if using directly, check from time to time if fixed
const SliderAny: any = Slider;
const HandleAny: any = Handle;

export interface SliderProps extends Focusable {
    value: number;
    onChange(newValue: number): void;
    min: number;
    max: number;
}

const handle = (props: any) => {
    const { value, ...restProps } = props;
    return (
        <HandleAny value={value} {...restProps} />
    );
};

export class SliderComponent extends React.Component<SliderProps> {

    render() {
        return (
            <SliderAny min={this.props.min} max={this.props.max} value={this.props.value} onChange={this.props.onChange} handle={handle} />
        );
    }
}

export const ConnectedSliderComponent = withCommitOnChange<SliderProps>(SliderComponent);
