import * as React from 'react';
import './IntegrationCodeDialog.scss';
import { CloseIconComponent } from './CloseIconComponent';

export interface HowToIntegrateDialogProps {
    isOpen: boolean;
    onClose(): void;
}

export function HowToIntegrateDialog(props: HowToIntegrateDialogProps) {

    return props.isOpen ? (
        <div className="dialog-overlay">
            <div className="dialog">
                <div className="dialog-title">
                    <div>How to integrate</div>
                    <CloseIconComponent onClick={props.onClose}/>
                </div>
                <div className="dialog-body">
                </div>
            </div>
        </div>
    ) : null;
}