import * as React from "react";
import { Focusable } from '../forms/Focusable';

export interface DelayedSynchronizationProps {
    setFocus(): void;
    updateProp(val: string): void;
    commitProp(): void;            

}


export function withDelayedSynchronization<T extends Focusable>(WrappedComponent: React.ComponentType<T>) {
    
    return class extends React.Component<Omit<T & DelayedSynchronizationProps, 'onBlur' | 'onFocus' | 'onChange'>> {

        render(): JSX.Element {
            // it seems to be a react bug to have to cast props to any
            return <WrappedComponent 
                {...this.props as any}
                onFocus={() => this.props.setFocus()}
                onChange={(val: string) => this.props.updateProp(val)}
                onBlur={() => this.props.commitProp()}
            />;
        }
    }
}