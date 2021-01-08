import { NodeParam, NodeParamField, PortDirection } from '../../../../core/models/objs/node_obj/NodeParam';
import { NodePortView } from '../../../../core/models/views/child_views/NodePortView';
import { ViewRenderer, ViewTag } from '../../../../core/models/views/View';
import { AbstractCanvasPanel } from '../../../../core/plugin/AbstractCanvasPanel';
import { MultiSelectController } from '../../../../core/plugin/controller/FormController';
import { UI_SvgForeignObject } from '../../../../core/ui_components/elements/svg/UI_SvgForeignObject';
import { UI_SvgGroup } from '../../../../core/ui_components/elements/svg/UI_SvgGroup';
import { UI_Column } from '../../../../core/ui_components/elements/UI_Column';
import { UI_SvgCanvas } from '../../../../core/ui_components/elements/UI_SvgCanvas';
import { colors, sizes } from '../../../../core/ui_components/react/styles';
import { NodeHeightCalc, NodeView } from '../models/views/NodeView';

export class NodeRenderer implements ViewRenderer {
    private joinPointsHeight: number;
    private nodeView: NodeView;

    constructor(nodeView: NodeView) {
        this.nodeView = nodeView;
    }

    renderInto(svgCanvas: UI_SvgCanvas, nodeView: NodeView, panel: AbstractCanvasPanel): void {
        const group = svgCanvas.group(nodeView.id);
        group.transform = `translate(${nodeView.getBounds().topLeft.x} ${nodeView.getBounds().topLeft.y})`;

        this.renderRect(group, nodeView);
        const column = this.renderContent(group, nodeView);
        column.data = nodeView;
        this.renderInputsInto(column, nodeView, panel);
    }

    private renderInputsInto(column: UI_Column, nodeView: NodeView, panel: AbstractCanvasPanel) {
        NodeParam.getFieldParams(nodeView.getObj())
            .map(param => {
                let row = column.row({key: param.name});
                row.height = NodeHeightCalc.getFieldHeight(param) + 'px';

                switch(param.field) {
                    case NodeParamField.NumberField:
                    case NodeParamField.TextField:
                        const inputfieldController = nodeView.controller.param[param.name];

                        const textField = row.textField({key: param.name, target: nodeView.id});
                        textField.paramController = inputfieldController;

                        textField.layout = 'horizontal';
                        textField.type = param.field === NodeParamField.TextField ? 'text' : 'number';
                        textField.label = param.name;
                        textField.isBold = true;
                        if (this.isFieldDisabled(param, nodeView)) {
                            textField.isDisabled = true
                        }
                    break;
                    case NodeParamField.List:
                        const listController = nodeView.controller.param[param.name];

                        const select = row.select({key: param.name, target: nodeView.id});
                        select.paramController = listController;
                        select.layout = 'horizontal';
                        select.label = param.name;
                        select.placeholder = param.name;
                        select.isBold = true;
                        if (this.isFieldDisabled(param, nodeView)) {
                            select.isDisabled = true
                        }
                    break;
                    case NodeParamField.Checkbox:
                        const checkbox = row.checkbox({key: param.name, target: nodeView.id});
                        checkbox.layout = 'horizontal';
                        checkbox.label = param.name;
                        if (this.isFieldDisabled(param, nodeView)) {
                            select.isDisabled = true
                        }
                    break;
                    case NodeParamField.MultiList:
                        const controller = <MultiSelectController> nodeView.controller.param[param.name];

                        const popupMultiSelect = row.popupMultiSelect({key: param.name, anchorElementKey: panel.region})
                        popupMultiSelect.popupWidth = '200px';
                        popupMultiSelect.paramController = controller;
                        popupMultiSelect.label = param.name;
                        popupMultiSelect.placeholder = 'Select mesh...';
                    break;
                }
            });
    }

    private isFieldDisabled(param: NodeParam, nodeView: NodeView) {
        return param.port && param.port.direction === PortDirection.Input && nodeView.getObj().getPort(param.name).hasConnectedPort()
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
        const foreignObject = group.foreignObject({key: nodeView.id, controller: nodeView.controller});
        foreignObject.width = nodeView.getBounds().getWidth();
        foreignObject.height = nodeView.getBounds().getHeight();
        foreignObject.css = {
            userSelect: 'none'
        }
    
        this.renderTitle(foreignObject, nodeView);
        this.renderPortsInto(group, nodeView);
    
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
    
    private renderPortsInto(svgGroup: UI_SvgGroup, nodeView: NodeView) {
        let inputs: number = 0;
        let outputs: number = 0;
    
        let rowHeight = 20;

        nodeView.getPortViews()
            .forEach((portView: NodePortView) => {
                if (NodeParam.isStandalonePort(portView.getObj().getNodeParam())) {
                    portView.getObj().isInputPort() ? (inputs++) : (outputs++);
                }
                this.renderPortInto(svgGroup, nodeView, portView);
            });
    
        this.joinPointsHeight = inputs > outputs ? inputs * rowHeight : outputs * rowHeight;
    }
    
    private renderPortInto(svgGroup: UI_SvgGroup, nodeView: NodeView, portView: NodePortView) {
        const circle = svgGroup.circle();
        svgGroup.data = nodeView;

        circle.cx = portView.point.x;
        circle.cy = portView.point.y;
        circle.r =  portView.isHovered() ? 7 : 5;
        circle.fillColor = colors.grey1
        circle.data = portView;
        circle.strokeColor = portView.isHovered() ? 'blue' : colors.panelBackground;
        circle.css = {
            strokeWidth: portView.isHovered() ? '2' : '1'
        }

        const nodeParam = portView.getObj().getNodeParam();
        if (NodeParam.isStandalonePort(nodeParam)) {
            const text = svgGroup.svgText({key: nodeParam.name});
            text.text = nodeParam.name;
            const textOffsetX = nodeParam.port.direction === PortDirection.Input ? 10 : -10;
            text.x = portView.point.x + textOffsetX;
            text.y = portView.point.y + 5;
            text.fontSize = '12px';
            text.isBold = true;
            nodeParam.port.direction === PortDirection.Output && (text.anchor = 'end');
        }

    }
}