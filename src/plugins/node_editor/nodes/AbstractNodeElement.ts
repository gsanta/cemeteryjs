import { Registry } from '../../../core/Registry';
import { NodeView } from '../../../core/models/views/NodeView';
import { colors } from '../../../core/gui/styles';
import { ToolType } from '../../common/tools/Tool';
import { UI_Plugin } from '../../../core/UI_Plugin';
import { UI_SvgCanvas } from '../../../core/gui_builder/elements/UI_SvgCanvas';
import { UI_Box } from '../../../core/gui_builder/elements/UI_Box';
import { UI_SvgGroup } from '../../../core/gui_builder/elements/svg/UI_SvgGroup';
import { JoinPointSlot } from '../../../core/models/nodes/NodeModel';
import { join } from 'path';
import { JoinPointView } from '../../../core/models/views/child_views/JoinPointView';
import { UI_SvgForeignObject } from '../../../core/gui_builder/elements/svg/UI_SvgForeignObject';


export abstract class AbstractNodeElement {
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

    protected renderFrameInto(svgCanvas: UI_SvgCanvas, nodeView: NodeView): void {
        const group = svgCanvas.group(nodeView.id);
        group.transform = `translate(${nodeView.dimensions.topLeft.x} ${nodeView.dimensions.topLeft.y})`;

        const rect = group.rect();
        rect.x = 0;
        rect.y = 0;
        rect.width = nodeView.dimensions.getWidth();
        rect.height = nodeView.dimensions.getHeight();
        rect.strokeColor = this.getStrokeColor(nodeView);

        this.renderConnectionSectionInto(group, nodeView);

        const foreignObject = group.foreignObject({key: nodeView.id});

        this.renderSettingsSectionInto(foreignObject, nodeView);
    }

    private renderConnectionSectionInto(svgGroup: UI_SvgGroup, nodeView: NodeView) {
        const inputSlots = nodeView.model.inputSlots;
        const outputSlots = nodeView.model.outputSlots;

        inputSlots.forEach(inputSlot => {
            inputSlot
        });
    
        const rows = inputSlots.length > outputSlots.length ? inputSlots.length : outputSlots.length;
        let inputs: number = 0;
        let outputs: number = 0;


        let rowHeight = 10;
        for (let i = 0; i < rows; i++) {

            nodeView.joinPointViews.forEach(joinPointView => {
                joinPointView.isInput ? (inputs++) : (outputs++);
                this.renderLabeledConnectionInto(svgGroup, nodeView, joinPointView, joinPointView.isInput ? inputs * rowHeight : outputs * rowHeight);
            });
        }
    }

    protected abstract renderSettingsSectionInto(foreignObject: UI_SvgForeignObject, nodeView: NodeView): void;


    private renderLabeledConnectionInto(svgGroup: UI_SvgGroup, nodeView: NodeView, joinPointView: JoinPointView, yPos: number): void {
        const circle = svgGroup.circle();
        const inputX = 5;
        const outputX = nodeView.dimensions.getWidth() - 5;

        circle.cx = joinPointView.isInput ? inputX : outputX;
        circle.cy = yPos;
        circle.r = 5;
        circle.fillColor = 'red';

        const text = svgGroup.svgText({key: joinPointView.slotName});
        text.text = joinPointView.slotName;
        text.x = joinPointView.isInput ? inputX + 10 : outputX - 10;
        text.y = yPos;
        joinPointView.isInput === false && (text.anchor === 'end');
    }
}