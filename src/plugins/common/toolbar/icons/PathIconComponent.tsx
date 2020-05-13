import * as React from 'react';
import { ToolStyled, ToolIconStyled, ToolIconBackgroundStyled, ToolIconImageStyled, ToolNameStyled, IconProps } from './ToolIcon';
import { AbstractIconComponent } from './AbstractIconComponent';

export class PathIconComponent extends AbstractIconComponent {

    constructor(props: IconProps) {
        super(props);

        this.tooltipText = 'Path tool';
    }

    render() {
        const toolName =  this.props.format === 'long' ? <ToolNameStyled>Path</ToolNameStyled> : null;
    
        return (
            <ToolStyled ref={this.ref} {...this.props}>
                <ToolIconStyled viewBox="0 0 24 24">
                    <ToolIconBackgroundStyled isActive={this.props.isActive} fill="none" d="M0 0h24v24H0z"/>
                    <ToolIconImageStyled isActive={this.props.isActive} d="M16.01 11H4v2h12.01v3L20 12l-3.99-4z"/>
                </ToolIconStyled>
                {toolName}
            </ToolStyled>  
        );
    }
}