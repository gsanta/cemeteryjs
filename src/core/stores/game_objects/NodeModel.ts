import { DroppableItem } from '../../plugins/tools/DragAndDropTool';
import { NodeGraph } from '../../services/node/NodeGraph';
import { NodeView, defaultNodeViewConfig } from '../views/NodeView';
import { View } from '../views/View';
import { Point } from '../../../utils/geometry/shapes/Point';

export enum BuiltinNodeType {
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

    for (let item in BuiltinNodeType) {
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

export interface NodeModelJson {
    type: string;
}

export interface NodeParam {
    name: string;
    val: any;
}

export abstract class NodeModel {
    nodeView: NodeView;
    type: BuiltinNodeType | string;
    category: NodeCategory;

    params: NodeParam[] = [];

    isDirty = false;
    label: string;
    color: string;
    size: Point;
    inputSlots: JoinPointSlot[];
    outputSlots: JoinPointSlot[];

    constructor(size: Point = new Point(defaultNodeViewConfig.width, defaultNodeViewConfig.height)) {
        this.size = size;
    }

    updateNode(graph: NodeGraph): void {}

    findSlotByName(name: string) {
        return this.inputSlots.find(slot => slot.name === name) || this.outputSlots.find(slot => slot.name === name);
    }

    getAllAdjacentNodes(): NodeModel[] {
        return this.nodeView.joinPointViews
            .filter(joinPointView => joinPointView.getOtherNode() !== undefined)
            .map(joinPointView => joinPointView.getOtherNode().model);
    }

    toJson(): NodeModelJson {
        return {
            type: this.type
        }
    }

    fromJson(json: NodeModelJson, viewMap: Map<string, View>) {
        this.type = <BuiltinNodeType> json.type;
    }
}

export class DroppableNode implements DroppableItem {
    itemType = 'Node'
    nodeTemplate: NodeModel;

    constructor(nodeTemplate: NodeModel) {
        this.nodeTemplate = nodeTemplate;
    }
}