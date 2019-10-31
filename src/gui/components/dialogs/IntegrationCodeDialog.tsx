import * as React from 'react';
import './IntegrationCodeDialog.scss';
import { CloseIconComponent } from './CloseIconComponent';
import { AppContext } from '../Context';

export interface IntegrationCodeDialogProps {
    isOpen: boolean;
    onClose(): void;
}

export class IntegrationCodeDialog extends React.Component<IntegrationCodeDialogProps> {

    render(): JSX.Element {
        return this.props.isOpen ? this.renderDialog() : null;
    }

    private renderDialog(): JSX.Element {
        return (
            <AppContext.Consumer>
                {value => 
                    <div className="dialog-overlay">
                        <div className="dialog">
                            <div className="dialog-title">
                                <div>Integration code</div>
                                <CloseIconComponent onClick={this.props.onClose}/>
                            </div>
                            <div className="dialog-body">
                                <pre>{value.controllers.worldMapController.getMap()}</pre>
                            </div>
                        </div>
                    </div>
                }
            </AppContext.Consumer>

        );
    }
}