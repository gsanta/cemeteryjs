import * as React from 'react';
import { UI_ComponentProps } from '../../../../ui_components/react/UI_ComponentProps';
import { UI_Tool } from '../../../../ui_components/elements/toolbar/UI_ToolIcon';
import { AbstractCanvasPlugin } from '../../../../plugins/AbstractCanvasPlugin';
import { cssClassBuilder } from '../../layout/BoxComp';

export interface ToolCompProps extends UI_ComponentProps<UI_Tool> {
    tooltip: JSX.Element;
}

export class ToolComp extends React.Component<ToolCompProps> {
    private ref: React.RefObject<HTMLDivElement> = React.createRef();
    
    render() {
        const selectedTool = (this.props.element.plugin as AbstractCanvasPlugin).toolHandler.getSelectedTool();
        const classes = cssClassBuilder(
            'ce-tool',
            `${this.props.element.icon}-icon`,
            selectedTool && (selectedTool.id === this.props.element.controllerId) ? 'ce-tool-active' : undefined
        );
        
        return (
            <div
                id={this.props.element.id}
                ref={this.ref}
                className={classes}
                onClick={() => (this.props.element.plugin as AbstractCanvasPlugin).toolHandler.setSelectedTool(this.props.element.controllerId)}
            >
                {this.props.tooltip}
            </div>
        );
    }
}

