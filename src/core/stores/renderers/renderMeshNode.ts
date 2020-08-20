import { UI_Row } from "../../ui_regions/elements/UI_Row";
import { MeshNodeProps } from "../nodes/controllers/MeshNodeController";
import { NodeView } from "../views/NodeView";
import { renderNodeFunc } from "./renderNodeFunc";


export const renderMeshNode: renderNodeFunc = (nodeView: NodeView, row: UI_Row) => {
    const layoutSelect = row.select(MeshNodeProps.SelectMesh);
    layoutSelect.layout = 'horizontal';
    layoutSelect.label = 'Mesh';
    layoutSelect.placeholder = 'Select Mesh';
}