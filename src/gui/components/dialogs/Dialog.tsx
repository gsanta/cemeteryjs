import * as React from 'react';
import { CloseIconComponent } from './CloseIconComponent';
import { ToggleButtonComponent } from '../forms/ToggleButtonComponent';
import styled from 'styled-components';
import { colors } from '../styles';

export interface DialogProps {
    title: string;
    isOpen: boolean;
    showFooter: boolean;
    onSubmit(): void;
    onCancel(): void;
}

const FooterStyled = styled.div`
    display: flex;
    justify-content: flex-end;
    padding: 5px;
    background: ${() => colors.getCanvasBackgroundLight(null)};

    button:not(:last-child) {
        margin-right: 10px;
    }
`;

export class Dialog extends React.Component<DialogProps> {

    render() {
        return this.props.isOpen ? this.renderDialog() : null;
    }

    private renderDialog(): JSX.Element {
        return (
            <div className="dialog-overlay">
                <div className="dialog">
                    <div className="dialog-title">
                        <div>World item definitions</div>
                        <CloseIconComponent onClick={() => this.props.onSubmit()}/>
                    </div>
                    <div className="dialog-body">
                        {this.props.children}
                    </div>
                    {this.props.showFooter ? this.renderFooter() : null}
                </div>
            </div>
        );
    }

    private renderFooter() {
        return (
            <FooterStyled>
                <ToggleButtonComponent text="Cancel" onChange={() => this.props.onCancel()} isActive={false}/>
                <ToggleButtonComponent text="Done" onChange={() => this.props.onSubmit()} isActive={false}/>
            </FooterStyled>
        )
    }
}