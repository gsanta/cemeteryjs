import * as React from 'react';
import { Hoverable } from '../../core/models/Hoverable';
import { InstanceProps } from '../InstanceProps';
import { colors } from '../../core/gui/styles';
import { ToolType } from './tools/Tool';


export class CanvasComponent<T extends Hoverable> extends React.Component<InstanceProps<T>> {
    
    getStrokeColor(): string {
        const selectionColor = this.props.registry.stores.selectionStore.contains(this.props.item) ? colors.views.highlight : undefined;
        const activeTool = this.props.registry.views.getActiveView().getActiveTool();
        const hoverColor = this.props.registry.services.pointer.hoveredItem === this.props.item ? activeTool.type === ToolType.Delete ? colors.views.delete : colors.views.highlight : undefined;

        return hoverColor || selectionColor || 'black';
    }
}