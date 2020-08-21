import { AbstractController } from './AbstractController';
import { NodeView } from '../../stores/views/NodeView';
import { UI_SvgCanvas } from '../../ui_regions/elements/UI_SvgCanvas';
import { UI_SvgGroup } from '../../ui_regions/elements/svg/UI_SvgGroup';
import { UI_SvgForeignObject } from '../../ui_regions/elements/svg/UI_SvgForeignObject';
import { sizes, colors } from '../../ui_regions/components/styles';
import { JoinPointView } from '../../stores/views/child_views/JoinPointView';
import { UI_Column } from '../../ui_regions/elements/UI_Column';

export class NodeRendererAndController extends AbstractController {
    nodeView: NodeView;
    controller: AbstractController;

    private joinPointsHeight: number;

    renderInto(svgCanvas: UI_SvgCanvas) {
        const group = svgCanvas.group(this.nodeView.id);
        group.transform = `translate(${this.nodeView.dimensions.topLeft.x} ${this.nodeView.dimensions.topLeft.y})`;

        this.renderRect(group);
        return this.renderContent(group);
    }

    private renderRect(group: UI_SvgGroup) {
        const rect = group.rect();
        rect.x = 0;
        rect.y = 0;
        rect.width = this.nodeView.dimensions.getWidth();
        rect.height = this.nodeView.dimensions.getHeight();
        rect.strokeColor = this.getStrokeColor();
        rect.fillColor = this.nodeView.model.color || 'white';
    }

    private renderContent(group: UI_SvgGroup): UI_Column {
        const foreignObject = group.foreignObject({key: this.nodeView.id});
        foreignObject.width = this.nodeView.dimensions.getWidth();
        foreignObject.height = this.nodeView.dimensions.getHeight();
        foreignObject.controller = this.controller;
    
        this.renderTitle(foreignObject);
        this.renderJoinPoints(group);
    
        let column = foreignObject.column({ key: 'data-row' });
        column.margin = `${this.joinPointsHeight}px 0 0 0`;
        column.vAlign = 'space-between';
        column.padding = '10px';

        return column;
    }
    
    private renderTitle(foreignObject: UI_SvgForeignObject) {
        const header = foreignObject.row({key: 'header-row'});
        header.height = sizes.nodes.headerHeight + 'px';
        header.padding = '2px 5px';
        header.backgroundColor = colors.panelBackground;
        
        const title = header.text();
        title.text = this.nodeView.model.type;
        title.isBold = true;
        title.color = colors.textColor;
    }
    
    private renderJoinPoints(svgGroup: UI_SvgGroup) {
        const inputSlots = this.nodeView.model.inputSlots;
        const outputSlots = this.nodeView.model.outputSlots;
    
        inputSlots.forEach(inputSlot => {
            inputSlot
        });
    
        const rows = inputSlots.length > outputSlots.length ? inputSlots.length : outputSlots.length;
        let inputs: number = 0;
        let outputs: number = 0;
    
        let rowHeight = 20;
        this.nodeView.joinPointViews.forEach(joinPointView => {
            joinPointView.isInput ? (inputs++) : (outputs++);
            this.renderLabeledJoinPointInto(svgGroup, joinPointView);
        });
    
        this.joinPointsHeight = inputs > outputs ? inputs * rowHeight : outputs * rowHeight;
    }
    
    private renderLabeledJoinPointInto(svgGroup: UI_SvgGroup, joinPointView: JoinPointView) {
        const circle = svgGroup.circle();
        svgGroup.data = this.nodeView;
    
        circle.cx = joinPointView.point.x;
        circle.cy = joinPointView.point.y;
        circle.r = 5;
        circle.fillColor = colors.grey4
        circle.data = joinPointView;
        circle.strokeColor = colors.panelBackground;
    
        const text = svgGroup.svgText({key: joinPointView.slotName});
        text.text = joinPointView.slotName;
        const textOffsetX = joinPointView.isInput ? 10 : -10;
        text.x = joinPointView.point.x + textOffsetX;
        text.y = joinPointView.point.y + 5;
        text.fontSize = '12px';
        text.isBold = true;
        joinPointView.isInput === false && (text.anchor = 'end');
    }
    
    private getStrokeColor(defaultColor = 'black'): string {
        // const selectionColor = this.registry.stores.selectionStore.contains(nodeView) ? colors.views.highlight : undefined;
        // let hoverColor: string = undefined
        // if (this.registry.plugins.getHoveredView()) {
        //     const activeTool = this.registry.plugins.getHoveredView().toolHandler.getActiveTool();
        //     hoverColor = this.registry.services.pointer.hoveredItem === nodeView ? activeTool.id === ToolType.Delete ? colors.views.delete : colors.views.highlight : undefined;
        // }
    
        // return hoverColor || selectionColor || defaultColor;
        return defaultColor;
    }
}