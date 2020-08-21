import { UI_Row } from "../../ui_regions/elements/UI_Row";
import { NodeView } from "../views/NodeView";
import { renderNodeFunc } from "./renderNodeFunc";
import { MoveNodeProps } from "../nodes/controllers/MoveNodeController";
import { UI_Column } from '../../ui_regions/elements/UI_Column';

export const renderMoveNode: renderNodeFunc = (nodeView: NodeView, column: UI_Column) => {
    let row = column.row({key: 'Select Movement'});
    row.height = '35px';

    const layoutSelect = row.select(MoveNodeProps.SelectMove);
    layoutSelect.layout = 'horizontal';
    layoutSelect.label = 'Move';
    layoutSelect.placeholder = 'Select Movement';
    layoutSelect.isBold = true;

    row = column.row({key: 'Speed'});
    row.height = '35px';

    const speedInput = row.textField(MoveNodeProps.Speed);
    speedInput.layout = 'horizontal';
    speedInput.type = 'number';
    speedInput.label = 'Speed';
    speedInput.isBold = true;
}