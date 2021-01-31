import { TableDefinition } from "cucumber";
import { Registry } from "../../../../../src/core/Registry";
import { NodeShape } from "../../../../../src/modules/graph_editor/main/models/shapes/NodeShape";
import { Point } from "../../../../../src/utils/geometry/shapes/Point";
import { collectViewTableProps, ViewTableProp } from "../../common/viewTestUtils";

export class NodeEditorTestUtils {
    static createViewsFromTable(registry: Registry, tableDef: TableDefinition) {
        const viewTableProps = collectViewTableProps(tableDef);
        
        let typeColumnIndex = viewTableProps.indexOf(ViewTableProp.Type);
        if (typeColumnIndex === -1) {
            throw new Error('To register views the the table must contain a \'Type\' column');
        }

        let posColumnIndex = viewTableProps.indexOf(ViewTableProp.Pos);
        if (posColumnIndex === -1) {
            throw new Error('To register views the the table must contain a \'Pos\' column');
        }

        let nodeTypeIndex = viewTableProps.indexOf(ViewTableProp.NodeType);
        if (nodeTypeIndex === -1) {
            throw new Error('To register views the the table must contain a \'NodeType\' column');
        }

        tableDef.rows().forEach((row: string[]) => {
            const nodeType = row[nodeTypeIndex]
            const nodeObj = registry.data.helper.node.createObj(nodeType);
            const nodeView: NodeShape = registry.data.helper.node.createView(nodeType, nodeObj);
            
            registry.data.shape.node.addItem(nodeView);
            registry.stores.objStore.addItem(nodeObj);
    
            nodeView.getBounds().moveTo(Point.fromString(row[posColumnIndex]));
        });
    }
}