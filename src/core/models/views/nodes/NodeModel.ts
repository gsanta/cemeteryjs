import { NodeGroupName } from "../../../../plugins/action_editor/settings/ActionEditorSettings";
import { NodeGraph } from '../../../services/node/NodeGraph';
import { NodeView } from '../NodeView';

export enum NodeType {
    Keyboard = 'Keyboard',
    Move = 'Move',
    Turn = 'Turn',
    And = 'And',
    Mesh = 'Mesh',
    Animation = 'Animation',
    Split = 'Split'
}
export type SlotName = 'input' | 'output' | 'mesh' | 'animation' | 'action' | 'input1' | 'input2' | 'output1' | 'output2' | 'output3' | 'output4'

export interface JoinPointSlot {
    name: SlotName;
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