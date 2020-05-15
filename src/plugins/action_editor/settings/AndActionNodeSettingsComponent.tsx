import * as React from 'react';
import { AppContext, AppContextType } from '../../../core/gui/Context';
import { ActionNodeProps } from './nodes/actionNodeSettingsFactory';

export class AndActionNodeSettingsComponent extends React.Component<ActionNodeProps> {
    static contextType = AppContext;
    context: AppContextType;

    render() {
        return (
            <div>
            </div>
        )
    }
}