import escapeHtml from 'escape-html';
import * as React from 'react';
import tippy from 'tippy.js';
import { UI_Tooltip } from '../../ui_regions/elements/UI_Tooltip';
import { UI_ComponentProps } from '../UI_ComponentProps';

export class TooltipComp extends React.Component<UI_ComponentProps<UI_Tooltip>> {
    componentDidMount() {
        let tooltipHtml = `${this.props.element.label}`;
        
        if (this.props.element.shortcut) {
            tooltipHtml += `<b>${escapeHtml(this.props.element.shortcut)}</b>`
        }

        if (this.props.element.label) {
            tippy(document.getElementById(this.props.element.anchorId) as any, {
                content: tooltipHtml,
                allowHTML: true
            });
        }
    }
    
    render() {
        return null;
    }
}
