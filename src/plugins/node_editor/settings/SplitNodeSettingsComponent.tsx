import * as React from 'react';
import { AbstractNodeSettingsComponent } from './AbstractNodeSettingsComponent';

export class SplitNodeSettingsComponent extends  AbstractNodeSettingsComponent {
    render() {
        return (
            <div>
                {this.renderSlots()}
            </div>
        )
    }
}