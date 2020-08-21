import { NodeView } from "../views/NodeView";
import { renderNodeFunc } from "./renderNodeFunc";
import { UI_Row } from "../../ui_regions/elements/UI_Row";
import { KeyboardNodeProps } from "../nodes/controllers/KeyboardNodeController";
import { UI_Column } from '../../ui_regions/elements/UI_Column';

export const renderKeyboardNode: renderNodeFunc = (nodeView: NodeView, column: UI_Column) => {
    const layoutSelect = column.select(KeyboardNodeProps.SelectKey);
    layoutSelect.layout = 'horizontal';
    layoutSelect.label = 'Key';
    layoutSelect.placeholder = 'Select Key';
}