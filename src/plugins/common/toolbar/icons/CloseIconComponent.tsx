import * as React from 'react';
import { IconProps, IconStyled, IconForgroundStyled } from '../../../../core/gui/icons/Icon';

export class CloseIconComponent extends React.Component<IconProps> {

    render() {
        return (
            <IconStyled className="icon icon-close" onClick={this.props.onClick} viewBox="0 0 24 24">
                <IconForgroundStyled {...this.props} d="M0 0 L24 24 M0 24 L24 0" stroke="#8D9DA5" strokeWidth="3px" />
            </IconStyled>
        );
    }
}
