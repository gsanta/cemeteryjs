import { UI_SvgForeignObject } from '../../ui_regions/elements/svg/UI_SvgForeignObject';
import { UI_SvgGroup } from '../../ui_regions/elements/svg/UI_SvgGroup';
import { UI_SvgCanvas } from "../../ui_regions/elements/UI_SvgCanvas";
import { JoinPointView } from "../views/child_views/JoinPointView";
import { NodeView } from "../views/NodeView";
import { join } from 'path';
import { colors, sizes } from '../../ui_regions/components/styles';
import { AbstractController } from '../../plugins/controllers/AbstractController';

export const renderNodeContainer = (nodeView: NodeView, svgCanvas: UI_SvgCanvas, controller: AbstractController): UI_SvgForeignObject => {
    const group = svgCanvas.group(nodeView.id);
    group.transform = `translate(${nodeView.dimensions.topLeft.x} ${nodeView.dimensions.topLeft.y})`;

    const rect = group.rect();
    rect.x = 0;
    rect.y = 0;
    rect.width = nodeView.dimensions.getWidth();
    rect.height = nodeView.dimensions.getHeight();
    rect.strokeColor = getStrokeColor(nodeView);
    rect.fillColor = 'white';
    
    const foreignObject = group.foreignObject({key: nodeView.id});
    foreignObject.width = nodeView.dimensions.getWidth();
    foreignObject.height = nodeView.dimensions.getHeight();

    renderTitleInto(nodeView, foreignObject);
    renderConnectionSectionInto(nodeView, group);
    foreignObject.controller = controller;

    return foreignObject;
}

const renderTitleInto = (nodeView: NodeView, foreignObject: UI_SvgForeignObject) => {
    const header = foreignObject.row({key: 'header-row'});
    header.height = sizes.nodes.headerHeight + 'px';
    header.padding = '2px 5px';
    header.backgroundColor = colors.panelBackground;
    
    const title = header.text();
    title.text = nodeView.model.type;
    title.isBold = true;
    title.color = colors.textColor;
    // const rect = foreignObject.rect();

    // rect.width = nodeView.dimensions.getWidth();
    // rect.height = sizes.nodes.headerHeight;
    // rect.fillColor = colors.panelBackground;

    // const text = foreignObject.svgText(null);
    // text.text = nodeView.model.type;
    // text.x = 5;
    // text.y = sizes.nodes.headerHeight - 5;
    // text.color = colors.textColor;
}

const renderConnectionSectionInto = (nodeView: NodeView, svgGroup: UI_SvgGroup) => {
    const inputSlots = nodeView.model.inputSlots;
    const outputSlots = nodeView.model.outputSlots;

    inputSlots.forEach(inputSlot => {
        inputSlot
    });

    const rows = inputSlots.length > outputSlots.length ? inputSlots.length : outputSlots.length;
    let inputs: number = 0;
    let outputs: number = 0;


    let rowHeight = 10;
    // for (let i = 0; i < rows; i++) {

        nodeView.joinPointViews.forEach(joinPointView => {
            joinPointView.isInput ? (inputs++) : (outputs++);
            renderLabeledConnectionInto(svgGroup, nodeView, joinPointView, joinPointView.isInput ? inputs * rowHeight : outputs * rowHeight);
        });
    // }
}

const renderLabeledConnectionInto = (svgGroup: UI_SvgGroup, nodeView: NodeView, joinPointView: JoinPointView, yPos: number): void => {
    const circle = svgGroup.circle();
    svgGroup.data = nodeView;

    circle.cx = joinPointView.point.x; //joinPointView.isInput ? inputX : outputX;
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
    joinPointView.isInput === false && (text.anchor = 'end');
}

const getStrokeColor = (nodeView: NodeView, defaultColor = 'black'): string => {
    // const selectionColor = this.registry.stores.selectionStore.contains(nodeView) ? colors.views.highlight : undefined;
    // let hoverColor: string = undefined
    // if (this.registry.plugins.getHoveredView()) {
    //     const activeTool = this.registry.plugins.getHoveredView().toolHandler.getActiveTool();
    //     hoverColor = this.registry.services.pointer.hoveredItem === nodeView ? activeTool.id === ToolType.Delete ? colors.views.delete : colors.views.highlight : undefined;
    // }

    // return hoverColor || selectionColor || defaultColor;
    return defaultColor;
}