import { renderNodeFunc } from "./renderNodeFunc";
import { NodeView } from "../views/NodeView";
import { UI_SvgForeignObject } from "../../ui_regions/elements/svg/UI_SvgForeignObject";
import { MeshNodeProps } from "../nodes/controllers/MeshNodeController";


export const renderMeshNode: renderNodeFunc = (nodeView: NodeView, foreignObject: UI_SvgForeignObject) => {
    let row = foreignObject.row({ key: 'data-row' });

    const layoutSelect = row.select(MeshNodeProps.SelectMesh);
    row.margin = '30px 0 0 0';
    row.hAlign = 'space-between';
    layoutSelect.layout = 'row';
    layoutSelect.label = 'Layouts';
    layoutSelect.placeholder = 'Select Layout';
}