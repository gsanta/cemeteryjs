import * as React from 'react';

export class CloseIconComponent extends React.Component<{ onClick: () => void }> {

    render() {
        return (
            <svg onClick={this.props.onClick} style={{ cursor: 'pointer', width: '16px', height: '16px' }} viewBox="0 0 24 24">
                <path d="M0 0 L24 24 M0 24 L24 0" stroke="#EDF0EE" strokeWidth="3px" />
            </svg>
        );
    }
}
