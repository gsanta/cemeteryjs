import * as React from "react";
import { InputFieldCommands } from "./InputFieldCommands";

export function withCommitOnChange<T>(WrappedComponent: React.ComponentType<T>) {
    return class extends React.Component<Omit<T & InputFieldCommands<any>, 'onChange'>> {

        render(): JSX.Element {
            // it seems to be a react bug to have to cast props to any
            return <WrappedComponent 
                {...this.props as any}
                onChange={(val: any) => {
                    this.updateProp(val);
                }}
            />;
        }

        private updateProp(val: any) {
            switch(this.props.propertyType) {
                case 'boolean':
                    this.props.formController.updateProp(val, this.props.propertyName);
                    break;
                case 'string':
                    this.props.formController.updateProp(val, this.props.propertyName);
                    break;
                case 'number':
                    this.props.formController.updateProp(parseInt(val, 10), this.props.propertyName);
                    break;
            }
        }
    }
}