import { Registry } from '../../../core/Registry';
import { NodeView } from '../../../core/models/views/NodeView';
import { colors } from '../../../core/gui/styles';
import { ToolType } from '../../common/tools/Tool';
import { UI_Plugin } from '../../../core/UI_Plugin';
import { UI_SvgCanvas } from '../../../core/gui_builder/elements/UI_SvgCanvas';
import { UI_Box } from '../../../core/gui_builder/elements/UI_Box';


export class AbstractNodeElement {
    protected registry: Registry;
    protected plugin: UI_Plugin;

    constructor(plugin: UI_Plugin, registry: Registry) {
        this.plugin = plugin;
        this.registry = registry;
    }


    protected getStrokeColor(nodeView: NodeView, defaultColor = 'black'): string {
        const selectionColor = this.registry.stores.selectionStore.contains(nodeView) ? colors.views.highlight : undefined;
        let hoverColor: string = undefined
        if (this.registry.plugins.getHoveredView()) {
            const activeTool = this.registry.plugins.getHoveredView().getActiveTool();
            hoverColor = this.registry.services.pointer.hoveredItem === nodeView ? activeTool.id === ToolType.Delete ? colors.views.delete : colors.views.highlight : undefined;
        }

        return hoverColor || selectionColor || defaultColor;
    }

    protected renderNodeFrameInto(svgCanvas: UI_SvgCanvas, nodeView: NodeView): void {
        const group1 = svgCanvas.group(nodeView.id);
        const group2 = group1.group(nodeView.id);
        group2.transform = `translate(${nodeView.dimensions.topLeft.x} ${nodeView.dimensions.topLeft.y})`;

        const rect = group2.rect();
        rect.x = 0;
        rect.y = 0;
        rect.width = nodeView.dimensions.getWidth();
        rect.height = nodeView.dimensions.getHeight();
        rect.strokeColor = this.getStrokeColor(nodeView);

        const foreignObject = group2.foreignObject({key: nodeView.id});
        const box = foreignObject.box
    }

    private renderSlotsInto(nodeView: NodeView): void {
        const inputSlots = nodeView.model.inputSlots;
        const outputSlots = nodeView.model.outputSlots;
    
        const rows = inputSlots.length > outputSlots.length ? inputSlots.length : outputSlots.length;

        const slots: JSX.Element[] = [];
        for (let i = 0; i < rows; i++) {
            slots.push(
                <SlotRowStyled>
                    <div>{inputSlots.length > i ? inputSlots[i].name : null}</div>
                    <div>{outputSlots.length > i ? outputSlots[i].name : null}</div>
                </SlotRowStyled>
            )
        }

        return slots;
    }

    protected abstract renderNodeBodyInto(box: UI_Box): void;
}