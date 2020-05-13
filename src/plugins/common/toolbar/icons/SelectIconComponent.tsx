import * as React from 'react';
import { ToolStyled, ToolIconStyled, ToolIconBackgroundStyled, ToolIconImageStyled, ToolNameStyled, IconProps } from './ToolIcon';
import tippy from 'tippy.js';

export class SelectIconComponent extends React.Component<IconProps> {
    private ref: React.RefObject<HTMLDivElement>;

    constructor(props: IconProps) {
        super(props);

        this.ref = React.createRef();
    }

    componentDidMount() {
        tippy(this.ref.current, {
            content: "I'm a Tippy tooltip!",
        });
    }
    
    render() {
        const toolName =  this.props.format === 'long' ? <ToolNameStyled>Select</ToolNameStyled> : null;
    
        return (
            <ToolStyled ref={this.ref} {...this.props}>
                <ToolIconStyled viewBox="0 0 24 24">
                    <ToolIconBackgroundStyled isActive={this.props.isActive} d="M0 0h24v24H0z" fill="none"/>
                    <ToolIconImageStyled isActive={this.props.isActive} d="M15 21h2v-2h-2v2zm4 0h2v-2h-2v2zM7 21h2v-2H7v2zm4 0h2v-2h-2v2zm8-4h2v-2h-2v2zm0-4h2v-2h-2v2zM3 3v18h2V5h16V3H3zm16 6h2V7h-2v2z"/>
                </ToolIconStyled>
                {toolName}
            </ToolStyled>       
        );
    }
}