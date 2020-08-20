import { UI_Row } from "../../ui_regions/elements/UI_Row";
import { NodeView } from "../views/NodeView";
import { renderNodeFunc } from "./renderNodeFunc";
import { TurnNodeProps } from "../nodes/controllers/TurnNodeController";


export const renderTurnNode: renderNodeFunc = (nodeView: NodeView, row: UI_Row) => {
    const layoutSelect = row.select(TurnNodeProps.SelectTurn);
    layoutSelect.layout = 'horizontal';
    layoutSelect.label = 'Turn';
    layoutSelect.placeholder = 'Select Turn';
}