import { NodeGroupName } from "../../../../plugins/action_editor/settings/ActionEditorSettings";
import { NodeGraph } from '../../../services/node/NodeGraph';
import { NodeView } from '../NodeView';
import { JoinPointView } from '../child_views/JoinPointView';

export enum NodeType {
    Keyboard = 'Keyboard',
    Action = 'Move',
    And = 'And',
    Mesh = 'Mesh',
    Animation = 'Animation'
}

export interface JoinPointSlot {
    name: string;
}

export abstract class NodeModel {
    nodeView: NodeView;

    constructor(nodeView: NodeView) {
        this.nodeView = nodeView;
    }
    isDirty = false;
    type: NodeType;
    group: NodeGroupName;
    title: string;
    color: string;
    inputSlots: JoinPointSlot[];
    outputSlots: JoinPointSlot[];
    updateNode(graph: NodeGraph): void {}

    findSlotByName(name: string) {
        return this.inputSlots.find(slot => slot.name === name) || this.outputSlots.find(slot => slot.name === name);
    }

    getAllAdjacentNodes(): NodeModel[] {
        return this.nodeView.joinPointViews
            .filter(joinPointView => joinPointView.getOtherNode() !== undefined)
            .map(joinPointView => joinPointView.getOtherNode().model);
    }
}