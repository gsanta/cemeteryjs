import * as React from 'react';
import tippy from 'tippy.js';
import { IconProps } from './ToolIcon';

export class AbstractIconComponent extends React.Component<IconProps> {
    protected ref: React.RefObject<HTMLDivElement>;
    protected tooltipText: string;

    constructor(props: IconProps) {
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