import * as React from 'react';
import tippy from 'tippy.js';
import { ToolIconProps } from './ToolIcon';

export class AbstractIconComponent extends React.Component<ToolIconProps> {
    protected ref: React.RefObject<HTMLDivElement>;
    protected tooltipText: string;

    constructor(props: ToolIconProps) {
        super(props);

        this.ref = React.createRef();
    }

    componentDidMount() {
        tippy(this.ref.current, {
            content: this.tooltipText,
            allowHTML: true
        });
    }
}