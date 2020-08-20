import { UI_Row } from "../../ui_regions/elements/UI_Row";
import { MeshNodeProps } from "../nodes/controllers/MeshNodeController";
import { NodeView } from "../views/NodeView";
import { renderNodeFunc } from "./renderNodeFunc";
import { PathNodeProps } from "../nodes/controllers/PathNodeController";


export const renderPathNode: renderNodeFunc = (nodeView: NodeView, row: UI_Row) => {
    const layoutSelect = row.select(PathNodeProps.SelectPath);
    layoutSelect.layout = 'horizontal';
    layoutSelect.label = 'Path';
    layoutSelect.placeholder = 'Select Path';
}