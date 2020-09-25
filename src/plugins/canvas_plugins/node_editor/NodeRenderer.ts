import { AbstractController } from '../../../core/plugin/controller/AbstractController';
import { UI_SvgCanvas } from '../../../core/ui_components/elements/UI_SvgCanvas';
import { UI_SvgGroup } from '../../../core/ui_components/elements/svg/UI_SvgGroup';
import { UI_SvgForeignObject } from '../../../core/ui_components/elements/svg/UI_SvgForeignObject';
import { sizes, colors } from '../../../core/ui_components/react/styles';
import { JoinPointView } from '../../../core/models/views/child_views/JoinPointView';
import { UI_Column } from '../../../core/ui_components/elements/UI_Column';
import { NodeView } from '../../../core/models/views/NodeView';
import { ViewTag } from '../../../core/models/views/View';

export class NodeRenderer extends AbstractController {
    controller: AbstractController;

    private joinPointsHeight: number;

    render(svgCanvas: UI_SvgCanvas, nodeView: NodeView) {
        const group = svgCanvas.group(nodeView.id);
        group.transform = `translate(${nodeView.getBounds().topLeft.x} ${nodeView.getBounds().topLeft.y})`;

        this.renderRect(group, nodeView);
        const column = this.renderContent(group, nodeView);
        column.controller = nodeView.controller;
        column.data = nodeView;
        this.renderInputsInto(column, nodeView);
    }

    private renderInputsInto(column: UI_Column, nodeView: NodeView) {
        nodeView.getObj().getParams().map(param => {
            let row = column.row({key: param.name});
            row.height = '35px';

            switch(param.inputType) {
                case 'textField':
                    const textField = row.textField({prop: param.name, target: nodeView.id});
                    textField.layout = 'horizontal';
                    textField.type = 'number';
                    textField.label = param.name;
                    textField.isBold = true;
                break;
                case 'list':
                    const select = row.select({prop: param.name, target: nodeView.id});
                    select.layout = 'horizontal';
                    select.label = param.name;
                    select.placeholder = param.name;
                    select.isBold = true;
                break;
            }
        });
    }

    private renderRect(group: UI_SvgGroup, nodeView: NodeView) {
        const rect = group.rect();
        rect.x = 0;
        rect.y = 0;
        rect.width = nodeView.getBounds().getWidth();
        rect.height = nodeView.getBounds().getHeight();
        rect.strokeColor = nodeView.tags.has(ViewTag.Selected) ? colors.views.highlight : 'black';
        rect.fillColor = nodeView.getObj().color || 'white';
        rect.css = {
            strokeWidth: nodeView.tags.has(ViewTag.Selected) ? '3' : '1'
        }
    }

    private renderContent(group: UI_SvgGroup, nodeView: NodeView): UI_Column {
        const foreignObject = group.foreignObject({key: nodeView.id});
        foreignObject.width = nodeView.getBounds().getWidth();
        foreignObject.height = nodeView.getBounds().getHeight();
        foreignObject.controller = this.controller;
        foreignObject.css = {
            userSelect: 'none'
        }
    
        this.renderTitle(foreignObject, nodeView);
        this.renderLinks(group, nodeView);
    
        let column = foreignObject.column({ key: 'data-row' });
        column.margin = `${this.joinPointsHeight}px 0 0 0`;
        column.vAlign = 'space-between';
        column.padding = '10px';

        return column;
    }
    
    private renderTitle(foreignObject: UI_SvgForeignObject, nodeView: NodeView) {
        const header = foreignObject.row({key: 'header-row'});
        header.height = sizes.nodes.headerHeight + 'px';
        header.padding = '2px 5px';
        header.backgroundColor = colors.panelBackground;
        
        const title = header.text();
        title.text = nodeView.getObj().displayName;
        title.isBold = true;
        title.color = colors.textColor;
    }
    
    private renderLinks(svgGroup: UI_SvgGroup, nodeView: NodeView) {
        let inputs: number = 0;
        let outputs: number = 0;
    
        let rowHeight = 20;
        nodeView.joinPointViews
        .forEach(joinPointView => {
            if (!nodeView.getObj().hasParam(joinPointView.slotName)) {
                joinPointView.isInput ? (inputs++) : (outputs++);
            }
            this.renderJoinPointInto(svgGroup, nodeView, joinPointView);
        });
    
        this.joinPointsHeight = inputs > outputs ? inputs * rowHeight : outputs * rowHeight;
    }
    
    private renderJoinPointInto(svgGroup: UI_SvgGroup, nodeView: NodeView, joinPointView: JoinPointView) {
        const circle = svgGroup.circle();
        svgGroup.data = nodeView;
    
        circle.cx = joinPointView.point.x;
        circle.cy = joinPointView.point.y;
        circle.r =  joinPointView.isHovered() ? 7 : 5;
        circle.fillColor = colors.grey4
        circle.data = joinPointView;
        circle.strokeColor = joinPointView.isHovered() ? 'blue' : colors.panelBackground;
        circle.css = {
            strokeWidth: joinPointView.isHovered() ? '2' : '1'
        }

        if (!nodeView.getObj().hasParam(joinPointView.slotName)) {
            const text = svgGroup.svgText({key: joinPointView.slotName});
            text.text = joinPointView.slotName;
            const textOffsetX = joinPointView.isInput ? 10 : -10;
            text.x = joinPointView.point.x + textOffsetX;
            text.y = joinPointView.point.y + 5;
            text.fontSize = '12px';
            text.isBold = true;
            joinPointView.isInput === false && (text.anchor = 'end');
        }

    }
}