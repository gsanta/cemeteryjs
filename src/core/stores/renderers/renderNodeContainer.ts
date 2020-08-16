import { UI_SvgForeignObject } from '../../ui_regions/elements/svg/UI_SvgForeignObject';
import { UI_SvgGroup } from '../../ui_regions/elements/svg/UI_SvgGroup';
import { UI_SvgCanvas } from "../../ui_regions/elements/UI_SvgCanvas";
import { JoinPointView } from "../views/child_views/JoinPointView";
import { NodeView } from "../views/NodeView";


export const renderNodeContainer = (nodeView: NodeView, svgCanvas: UI_SvgCanvas): UI_SvgForeignObject => {
    const group = svgCanvas.group(nodeView.id);
    group.transform = `translate(${nodeView.dimensions.topLeft.x} ${nodeView.dimensions.topLeft.y})`;

    const rect = group.rect();
    rect.x = 0;
    rect.y = 0;
    rect.width = nodeView.dimensions.getWidth();
    rect.height = nodeView.dimensions.getHeight();
    rect.strokeColor = this.getStrokeColor(nodeView);

    renderConnectionSectionInto(nodeView, group);

    const foreignObject = group.foreignObject({key: nodeView.id});

    return foreignObject;
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
    for (let i = 0; i < rows; i++) {

        nodeView.joinPointViews.forEach(joinPointView => {
            joinPointView.isInput ? (inputs++) : (outputs++);
            renderLabeledConnectionInto(svgGroup, nodeView, joinPointView, joinPointView.isInput ? inputs * rowHeight : outputs * rowHeight);
        });
    }
}

const renderLabeledConnectionInto = (svgGroup: UI_SvgGroup, nodeView: NodeView, joinPointView: JoinPointView, yPos: number): void => {
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