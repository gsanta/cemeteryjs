import { DroppableItem } from '../../../plugins/common/tools/DragAndDropTool';
import { NodeGraph } from '../../services/node/NodeGraph';
import { NodeView } from '../views/NodeView';
import { NodeSettings } from '../../../plugins/action_editor/settings/NodeSettings';

export enum NodeType {
    Keyboard = 'Keyboard',
    Move = 'Move',
    Turn = 'Turn',
    And = 'And',
    Mesh = 'Mesh',
    Route = 'Route',
    Path = 'Path',
    Animation = 'Animation',
    Split = 'Split'
}

export function getAllNodeTypes() {
    const nodeTypes: string[] = [];

    for (let item in NodeType) {
        if (isNaN(Number(item))) {
            nodeTypes.push(item);
        }
    }

    return nodeTypes;
}

export enum NodeCategory {
    Input = 'Input',
    Boolean = 'Boolean',
    Default = 'Default'
}

export type SlotName = 'input' | 'output' | 'mesh' | 'animation' | 'action' | 'input1' | 'input2' | 'output1' | 'output2' | 'output3' | 'output4' | 'path'

export interface JoinPointSlot {
    name: string;
}

export abstract class NodeModel {
    nodeView: NodeView;
    type: NodeType;
    category: NodeCategory;

    constructor(nodeView: NodeView) {
        this.nodeView = nodeView;
    }
    isDirty = false;
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

export class DroppableNode implements DroppableItem {
    itemType = 'Node'
    nodeTemplate: NodeModel;

    constructor(nodeTemplate: NodeModel) {
        this.nodeTemplate = nodeTemplate;
    }
}