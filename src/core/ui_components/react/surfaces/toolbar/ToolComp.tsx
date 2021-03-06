import * as React from 'react';
import { UI_ComponentProps } from '../../UI_ComponentProps';
import { UI_Tool } from '../../../elements/toolbar/UI_Tool';
import { cssClassBuilder } from '../../layout/BoxComp';

export interface ToolCompProps extends UI_ComponentProps<UI_Tool> {
    tooltip: JSX.Element;
}

export class ToolComp extends React.Component<ToolCompProps> {
    private ref: React.RefObject<HTMLDivElement> = React.createRef();
    
    render() {
        const classes = cssClassBuilder(
            'ce-tool',
            `${this.props.element.icon}-icon`,
            this.props.element.isActive ? 'ce-tool-active' : undefined,
            this.props.element.color ? `ce-bg-${this.props.element.color}` : undefined
        );
        
        return (
            <div
                id={this.props.element.uniqueId}
                ref={this.ref}
                className={classes}
                onClick={() => this.props.element.click(this.props.registry)}
            >
                {this.props.tooltip}
            </div>
        );
    }
}

