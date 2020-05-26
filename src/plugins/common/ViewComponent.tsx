import * as React from 'react';
import { AppContext, AppContextType } from '../../core/gui/Context';
import { colors } from '../../core/gui/styles';
import { VisualConcept } from '../../core/models/concepts/VisualConcept';
import { InstanceProps } from '../InstanceProps';
import { ToolType } from './tools/Tool';


export class ViewComponent<T extends VisualConcept> extends React.Component<InstanceProps<T>> {
    static contextType = AppContext;
    context: AppContextType;
    protected ref: React.RefObject<HTMLDivElement>;

    constructor(props: InstanceProps<T>) {
        super(props);

        this.ref = React.createRef();
    }

    componentDidMount() {
        this.ref.current && this.context.registry.services.hotkey.registerInput(this.ref.current);
    }

    componentWillUnmount() {

    }
    
    getStrokeColor(defaultColor = 'black'): string {
        const selectionColor = this.props.registry.stores.selectionStore.contains(this.props.item) ? colors.views.highlight : undefined;
        const activeTool = this.props.registry.views.getActiveView().getActiveTool();
        const hoverColor = this.props.registry.services.pointer.hoveredItem === this.props.item ? activeTool.type === ToolType.Delete ? colors.views.delete : colors.views.highlight : undefined;

        return hoverColor || selectionColor || defaultColor;
    }
}