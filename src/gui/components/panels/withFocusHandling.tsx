import * as React from "react";
import { Focusable } from '../forms/Focusable';

export interface StateSynchronizer {
    commitChanges(): void;
}

export function withFocusHandling<T extends Focusable & StateSynchronizer>(WrappedComponent: React.ComponentType<T>) {
    
    return class extends React.Component<T> {

        render() {
            return <WrappedComponent {...this.props} onBlur={this.props.commitChanges} />;
        }
    }
}