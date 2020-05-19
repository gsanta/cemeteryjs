import { NodeGroupName } from "../../../../plugins/action_editor/settings/ActionEditorSettings";
import { AbstractNode, NodeType } from "./AbstractNode";
import { NodeGraph } from '../../NodeGraph';
import { MeshNode } from './MeshNode';

export enum Movement {
    Left = 'Move Left',
    Right = 'Move Right',
    Forward = 'Move Forward',
    Backward = 'Move Backward'
}

export function getAllMovements() {
    const movements: string[] = [];

    for (let item in Movement) {
        if (isNaN(Number(item))) {
            movements.push(item);
        }
    }

    return movements;
}

export class ActionNode extends AbstractNode {
    type = NodeType.Move;
    group = NodeGroupName.Default;
    title = "Action";
    action: string;
    allActions: string[] = [];
    color = 'A194EC';
    inputSlots = [
        {
            name: 'input'
        },
        {
            name: 'mesh'
        }
    ];
    outputSlots = [
        {
            name: 'animation'
        }
    ];

    private meshNode: string;

    updateNode(graph: NodeGraph) {
        this.allActions = [];
        const joinPointView = this.nodeView.findJoinPointViewByName('mesh', true);
        if (!joinPointView.getOtherNode()) { return; }

        const meshView = (<MeshNode> joinPointView.getOtherNode().node).meshView;
        if (meshView) {
            this.allActions = meshView.actions;
        }
    }
}