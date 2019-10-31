import * as React from 'react';
import './IntegrationCodeDialog.scss';
import { CloseIconComponent } from './CloseIconComponent';

export interface AboutDialogProps {
    isOpen: boolean;
    onClose(): void;
}

export function AboutDialog(props: AboutDialogProps) {

    return props.isOpen ? (
        <div className="dialog-overlay">
            <div className="dialog">
                <div className="dialog-title">
                    <div>About</div>
                    <CloseIconComponent onClick={props.onClose}/>
                </div>
                <div className="dialog-body">
                    version: 0.2.57 <br/>
                    contribute:  <a href="https://github.com/gsanta/nightshifts-inc-world-generator" target="_blank">https://github.com/gsanta/nightshifts-inc-world-generator</a><br/>
                </div>
            </div>
        </div>
    ) : null;
}