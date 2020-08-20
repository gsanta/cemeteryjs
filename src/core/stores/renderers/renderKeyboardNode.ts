import { NodeView } from "../views/NodeView";
import { renderNodeFunc } from "./renderNodeFunc";
import { UI_Row } from "../../ui_regions/elements/UI_Row";
import { KeyboardNodeProps } from "../nodes/controllers/KeyboardNodeController";

export const renderKeyboardNode: renderNodeFunc = (nodeView: NodeView, row: UI_Row) => {
    const layoutSelect = row.select(KeyboardNodeProps.SelectKey);
    layoutSelect.layout = 'horizontal';
    layoutSelect.label = 'Key';
    layoutSelect.placeholder = 'Select Key';
}