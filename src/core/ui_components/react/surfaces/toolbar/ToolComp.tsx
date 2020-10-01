import * as React from 'react';
import { UI_ComponentProps } from '../../UI_ComponentProps';
import { UI_Tool } from '../../../elements/toolbar/UI_ToolIcon';
import { cssClassBuilder } from '../../layout/BoxComp';
import { AbstractCanvasPlugin } from '../../../../plugin/AbstractCanvasPlugin';
import { ToolController } from '../../../../plugin/controller/ToolController';

export interface ToolCompProps extends UI_ComponentProps<UI_Tool> {
    tooltip: JSX.Element;
}

export class ToolComp extends React.Component<ToolCompProps> {
    private ref: React.RefObject<HTMLDivElement> = React.createRef();
    
    render() {
        const toolController = (this.props.registry.plugins.getControllers(this.props.element.plugin.id).get(this.props.element.controllerId) as ToolController);

        const classes = cssClassBuilder(
            'ce-tool',
            `${this.props.element.icon}-icon`,
            toolController.getSelectedTool() && (toolController.getSelectedTool().id === this.props.element.controllerId) ? 'ce-tool-active' : undefined,
            this.props.element.color ? `ce-bg-${this.props.element.color}` : undefined
        );
        
        return (
            <div
                id={this.props.element.id}
                ref={this.ref}
                className={classes}
                onClick={() => toolController.setSelectedTool(this.props.element.controllerId)}
            >
                {this.props.tooltip}
            </div>
        );
    }
}

