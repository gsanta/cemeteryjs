import * as React from 'react';
import { colors } from '../styles';
import { IconProps, IconStyled, IconForgroundStyled } from '../icons/Icon';

export class CloseIconComponent extends React.Component<IconProps> {

    render() {
        return (
            <IconStyled className="icon icon-close" {...this.props} viewBox="0 0 24 24">
                <IconForgroundStyled {...this.props} d="M0 0 L24 24 M0 24 L24 0" stroke={this.props.color ? this.props.color : colors.textColor} strokeWidth="2px" />
            </IconStyled>
        );
    }
}
