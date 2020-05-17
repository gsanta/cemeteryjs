import * as React from 'react';
import { AppContext, AppContextType } from '../../../core/gui/Context';
import { NodeProps } from './nodes/actionNodeSettingsFactory';

export class AndActionNodeSettingsComponent extends React.Component<NodeProps> {
    static contextType = AppContext;
    context: AppContextType;

    render() {
        return (
            <div>
            </div>
        )
    }
}