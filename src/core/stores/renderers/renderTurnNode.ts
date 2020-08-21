import { UI_Row } from "../../ui_regions/elements/UI_Row";
import { NodeView } from "../views/NodeView";
import { renderNodeFunc } from "./renderNodeFunc";
import { TurnNodeProps } from "../nodes/controllers/TurnNodeController";
import { UI_Column } from '../../ui_regions/elements/UI_Column';


export const renderTurnNode: renderNodeFunc = (nodeView: NodeView, column: UI_Column) => {
    const row = column.row({key: 'select_turn'});
    const layoutSelect = column.select(TurnNodeProps.SelectTurn);
    layoutSelect.layout = 'horizontal';
    layoutSelect.label = 'Turn';
    layoutSelect.placeholder = 'Select Turn';
}