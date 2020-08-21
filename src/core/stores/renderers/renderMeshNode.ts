import { UI_Row } from "../../ui_regions/elements/UI_Row";
import { MeshNodeProps } from "../nodes/controllers/MeshNodeController";
import { NodeView } from "../views/NodeView";
import { renderNodeFunc } from "./renderNodeFunc";
import { UI_Column } from '../../ui_regions/elements/UI_Column';


export const renderMeshNode: renderNodeFunc = (nodeView: NodeView, column: UI_Column) => {
    const row = column.row({key: 'select_mesh'});

    const layoutSelect = row.select(MeshNodeProps.SelectMesh);
    layoutSelect.layout = 'horizontal';
    layoutSelect.label = 'Mesh';
    layoutSelect.placeholder = 'Select Mesh';
}