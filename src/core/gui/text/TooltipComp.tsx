import * as React from 'react';
import { UI_Tooltip } from '../../gui_builder/elements/UI_Tooltip';
import { UI_ComponentProps } from '../UI_ComponentProps';
import * as escapeHtml from 'escape-html';
import tippy from 'tippy.js';
import { cssClassBuilder } from '../../gui_builder/UI_ReactElements';

export class ToolTipComp extends React.Component<UI_ComponentProps<UI_Tooltip>> {
    private ref: React.RefObject<HTMLDivElement> = React.createRef();

    componentDidMount() {
        let tooltipHtml = `${this.props.element.label}`;
        
        if (this.props.element.shortcut) {
            tooltipHtml += `<b>${escapeHtml(this.props.element.shortcut)}</b>`
        }

        if (this.props.element.label) {
            tippy(this.ref.current as any, {
                content: tooltipHtml,
                allowHTML: true
            });
        }
    }
    
    render() {
        const classes = cssClassBuilder('ce-tool', `${this.props.element.icon}-icon`);
        return <div ref={this.ref} className={classes}></div>;
    }
}
