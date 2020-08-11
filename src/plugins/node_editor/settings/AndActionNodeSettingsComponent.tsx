import * as React from 'react';
import { AppContext, AppContextType } from '../../../core/ui_regions/components/Context';
import { NodeProps } from './nodes/nodeSettingsFactory';

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