import { UI_Row } from "../../ui_regions/elements/UI_Row";
import { MeshNodeProps } from "../nodes/controllers/MeshNodeController";
import { NodeView } from "../views/NodeView";
import { renderNodeFunc } from "./renderNodeFunc";
import { PathNodeProps } from "../nodes/controllers/PathNodeController";
import { UI_Column } from '../../ui_regions/elements/UI_Column';


export const renderPathNode: renderNodeFunc = (nodeView: NodeView, column: UI_Column) => {
    const row = column.row({key: 'select_path'});
    const layoutSelect = row.select(PathNodeProps.SelectPath);
    layoutSelect.layout = 'horizontal';
    layoutSelect.label = 'Path';
    layoutSelect.placeholder = 'Select Path';
}