import * as React from 'react';
import './Header.scss';
import { Button } from './forms/Button';

export interface HeaderProps {
    model: string;
    openIntegrationCodeDialog(): void;
}

export class Header extends React.Component<HeaderProps> {

    constructor(props: HeaderProps) {
        super(props);

    }

    render() {
        return (
            <div id="header">
                <Button text="Get integration code" onClick={() => this.props.openIntegrationCodeDialog()}/>
            </div>
        );
    }
}