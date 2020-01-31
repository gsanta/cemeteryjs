import * as React from "react";
import { Focusable } from '../../../../editor/gui/forms/Focusable';
import { InputFieldCommands } from "./InputFieldCommands";

export function withCommitOnChange<T extends Focusable>(WrappedComponent: React.ComponentType<T>) {
    
    return class extends React.Component<Omit<T & InputFieldCommands<any>, 'onBlur' | 'onFocus' | 'onChange'>> {

        render(): JSX.Element {
            // it seems to be a react bug to have to cast props to any
            return <WrappedComponent 
                {...this.props as any}
                onFocus={() => this.props.formController.focusProp(this.props.propertyName)}
                onChange={(val: any) => {
                    this.updateProp(val);
                    this.props.formController.commitProp();
                }}
                onBlur={() => null}
            />;
        }

        private updateProp(val: any) {
            switch(this.props.propertyType) {
                case 'boolean':
                    this.props.formController.updateProp(val);
                    break;
                case 'string':
                    this.props.formController.updateProp(val);
                    break;
                case 'number':
                    this.props.formController.updateProp(parseInt(val, 10));
                    break;
            }
        }
    }
}