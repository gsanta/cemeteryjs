import * as escapeHtml from 'escape-html';
import * as React from 'react';
import tippy from 'tippy.js';
import { UI_Tooltip } from '../../gui_builder/elements/UI_Tooltip';
import { UI_ComponentProps } from '../UI_ComponentProps';

export class ToolTipComp extends React.Component<UI_ComponentProps<UI_Tooltip>> {
    private ref: React.RefObject<HTMLDivElement> = React.createRef();

    componentDidMount() {
        let tooltipHtml = `${this.props.element.label}`;
        
        if (this.props.element.shortcut) {
            tooltipHtml += `<b>${escapeHtml(this.props.element.shortcut)}</b>`
        }

        if (this.props.element.label) {
            tippy(this.ref.current as any, {
                content: document.getElementById(this.props.element.parentId),
                allowHTML: true
            });
        }
    }
    
    render() {
        return null;
    }
}
