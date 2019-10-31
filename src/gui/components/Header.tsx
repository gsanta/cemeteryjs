import * as React from 'react';
import './Header.scss';
import { ButtonComponent } from './forms/ButtonComponent';

export interface HeaderProps {
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
                    <ButtonComponent text="Get integration code" type="success" onClick={() => this.props.openIntegrationCodeDialog()}/>
                    <ButtonComponent text="How to integrate" type="info" onClick={() => this.props.openHowToIntegrateDialog()}/>
                </div>
                <div>
                    <ButtonComponent text="About" type="info" onClick={() => this.props.openAboutDialog()}/>
                </div>
            </div>
        );
    }
}