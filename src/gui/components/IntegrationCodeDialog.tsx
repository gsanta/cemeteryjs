import * as React from 'react';
import './IntegrationCodeDialog.scss';

export interface IntegrationCodeDialogProps {
    isOpen: boolean;
    worldMap: string;
}

export function IntegrationCodeDialog(props: IntegrationCodeDialogProps) {

    return props.isOpen ? (
        <div className="dialog-overlay">
            <div className="dialog">
                <div className="dialog-title">
                    <div>Integration code</div>
                </div>
                <div className="dialog-body">
                    <pre>{props.worldMap}</pre>
                </div>
            </div>
        </div>
    ) : null;
}