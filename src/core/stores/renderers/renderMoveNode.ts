import { UI_Row } from "../../ui_regions/elements/UI_Row";
import { NodeView } from "../views/NodeView";
import { renderNodeFunc } from "./renderNodeFunc";
import { MoveNodeProps } from "../nodes/controllers/MoveNodeController";


export const renderMoveNode: renderNodeFunc = (nodeView: NodeView, row: UI_Row) => {
    const layoutSelect = row.select(MoveNodeProps.SelectMove);
    layoutSelect.layout = 'horizontal';
    layoutSelect.label = 'Move';
    layoutSelect.placeholder = 'Select Movement';

    const speedInput = row.textField(MoveNodeProps.Speed);
    speedInput.type = 'number';
    speedInput.label = 'Speed'
}