import { IconProps, ToolIconStyled, ToolIconImageStyled, ToolIconBackgroundStyled, ToolStyled, ToolNameStyled } from "../../../plugins/common/toolbar/icons/ToolIcon";
import * as React from 'react';
import { AbstractIconComponent } from "../../../plugins/common/toolbar/icons/AbstractIconComponent";

export class FullScreenIconComponent extends AbstractIconComponent {

    constructor(props: IconProps) {
        super(props);

        this.tooltipText = 'Full screen';
    }

    render() {
        const toolName =  this.props.format === 'long' ? <ToolNameStyled>Full screen</ToolNameStyled> : null;
    
        return (
            <ToolStyled ref={this.ref} {...this.props}>
                <ToolIconStyled viewBox="0 0 24 24">
                    <ToolIconBackgroundStyled isActive={this.props.isActive} d="M0 0h24v24H0z"/>
                    <ToolIconImageStyled isActive={this.props.isActive} d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                </ToolIconStyled>
                {toolName}
            </ToolStyled>
        );
    }
}