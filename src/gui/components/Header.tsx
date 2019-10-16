import * as React from 'react';
import './Header.scss';
import { Button } from './forms/Button';

export interface HeaderProps {
    model: string;
    openIntegrationCodeDialog(): void;
    openHowToIntegrateDialog(): void;
    openAboutDialog(): void;
}

export class Header extends React.Component<HeaderProps> {

    constructor(props: HeaderProps) {
        super(props);

    }

    render() {
        return (
            <div id="header">
                <div>
                    <Button text="Get integration code" type="success" onClick={() => this.props.openIntegrationCodeDialog()}/>
                    <Button text="How to integrate" type="info" onClick={() => this.props.openHowToIntegrateDialog()}/>
                </div>
                <div>
                    <Button text="About" type="info" onClick={() => this.props.openAboutDialog()}/>
                </div>
            </div>
        );
    }
}