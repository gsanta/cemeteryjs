import * as React from 'react';
import { UI_ComponentProps } from '../../UI_ComponentProps';
import { cssClassBuilder } from '../../layout/BoxComp';
import { UI_ActionIcon } from '../../../elements/toolbar/UI_ActionIcon';

export interface ActionIconCompProps extends UI_ComponentProps<UI_ActionIcon> {
    tooltip: JSX.Element;
}

export class ActionIconComp extends React.Component<ActionIconCompProps> {
    private ref: React.RefObject<HTMLDivElement> = React.createRef();

    componentDidMount() {
        const tooltipHtml = `Eraser tool <b>(Shift + E)</b>`

        if (this.props.element.tooltip) {
            // tippy(this.ref.current as any, {
            //     content: this.props.element.tooltip,
            //     allowHTML: true
            // });
        }
    }
    
    render() {
        const classes = cssClassBuilder(
            'ce-tool',
            `${this.props.element.icon}-icon`,
            this.props.element.isActivated ? 'ce-tool-active' : undefined
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

