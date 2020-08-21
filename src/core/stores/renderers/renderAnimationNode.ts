import { NodeView } from "../views/NodeView";
import { renderNodeFunc } from "./renderNodeFunc";
import { UI_Row } from "../../ui_regions/elements/UI_Row";
import { AnimationNodeProps } from "../nodes/controllers/AnimationNodeController";
import { UI_Column } from '../../ui_regions/elements/UI_Column';

export const renderAnimationNode: renderNodeFunc = (nodeView: NodeView, column: UI_Column) => {
    const row = column.row({key: 'select_animation'});
    const layoutSelect = row.select(AnimationNodeProps.SelectAnimation);
    layoutSelect.layout = 'horizontal';
    layoutSelect.label = 'Animation';
    layoutSelect.placeholder = 'Select Animation';
}