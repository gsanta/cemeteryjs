import * as React from "react";
import { Focusable } from '../../inputs/Focusable';
import { InputFieldCommands } from "./InputFieldCommands";

export function withCommitOnBlur<T extends Focusable>(WrappedComponent: React.ComponentType<T>) {
    
    return class extends React.Component<Omit<T & InputFieldCommands<any>, 'onBlur' | 'onFocus' | 'onChange'>> {
        render(): JSX.Element {
            // it seems to be a react bug to have to cast props to any
            return <WrappedComponent 
                {...this.props as any}
                onFocus={() => this.props.formController.focusProp(this.props.propertyName)}
                onChange={
                    (val: string) => {
                        if (this.props.formController.getFocusedProp() !== this.props.propertyName) {
                            this.props.formController.focusProp(this.props.propertyName);
                            this.updateProp(val);
                            this.props.formController.blurProp();
                        } else {
                            this.updateProp(val);
                        }
                    }
                }
                onBlur={() => this.props.formController.blurProp()}
            />;
        }

        private updateProp(val: any) {
            switch(this.props.propertyType) {
                case 'boolean':
                    this.props.formController.updateFocusedProp(val);
                    break;
                case 'string':
                case 'number':
                    this.props.formController.updateFocusedProp(val);
                    break;
            }
        }
    }
}