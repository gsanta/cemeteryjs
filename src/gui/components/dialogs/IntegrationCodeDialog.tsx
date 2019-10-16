import * as React from 'react';
import './IntegrationCodeDialog.scss';
import { CloseIconComponent } from './CloseIconComponent';

export interface IntegrationCodeDialogProps {
    isOpen: boolean;
    worldMap: string;
    onClose(): void;
}

export function IntegrationCodeDialog(props: IntegrationCodeDialogProps) {

    return props.isOpen ? (
        <div className="dialog-overlay">
            <div className="dialog">
                <div className="dialog-title">
                    <div>Integration code</div>
                    <CloseIconComponent onClick={props.onClose}/>
                </div>
                <div className="dialog-body">
                    <pre>{props.worldMap}</pre>
                </div>
            </div>
        </div>
    ) : null;
}