import { NodeType } from "../../../models/views/nodes/NodeModel";
import { MoveNode } from '../../../models/views/nodes/MoveNode';
import { AbstractNodeHandler } from "./AbstractNodeHandler";
import { MeshNode } from "../../../models/views/nodes/MeshNode";
import { SplitNode } from '../../../models/views/nodes/SplitNode';

export class SplitNodeHandler extends AbstractNodeHandler {
    nodeType: NodeType.Split;

    handle(node: SplitNode) {
        this.chainLeft(node, 'input');
    }
}