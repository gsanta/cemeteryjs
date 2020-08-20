import { NodeView } from "../views/NodeView";
import { renderNodeFunc } from "./renderNodeFunc";
import { UI_Row } from "../../ui_regions/elements/UI_Row";
import { AnimationNodeProps } from "../nodes/controllers/AnimationNodeController";

export const renderAnimationNode: renderNodeFunc = (nodeView: NodeView, row: UI_Row) => {
    const layoutSelect = row.select(AnimationNodeProps.SelectAnimation);
    layoutSelect.layout = 'horizontal';
    layoutSelect.label = 'Animation';
    layoutSelect.placeholder = 'Select Animation';
}