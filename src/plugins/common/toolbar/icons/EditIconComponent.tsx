
import * as React from 'react';
import { IconProps, IconStyled, IconForgroundStyled } from '../../../../core/gui/icons/Icon';
import { colors } from '../../../../core/gui/styles';

export class EditIconComponent extends React.Component<IconProps> {

    render() {
        return (
            <IconStyled className="icon icon-close" {...this.props} viewBox="0 0 24 24">
                <path d="M0 0h24v24H0z" fill="none"/>
                <IconForgroundStyled {...this.props} d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" stroke={this.props.color ? this.props.color : colors.textColor} />
            </IconStyled>
        );
    }
}