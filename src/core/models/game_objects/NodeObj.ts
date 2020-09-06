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
    params: NodeParam[];
    inputSlots: JoinPointSlot[];
    outputSlots: JoinPointSlot[];
    label: string;
    color: string;
    sizeX: number;
    sizeY: number;
    category: string;
}

export interface NodeConfig {
    type: string;
    params: NodeParam[];
    connections: { direction: 'input' | 'output', name: string }[];
    category: string; 
}

export interface NodeParam {
    name: string;
    val: any;
    inputType: 'textField' | 'list';
    valueType: 'string' | 'number';
}

export class NodeObj {
    nodeView: NodeView;
    type: BuiltinNodeType | string;
    category: string;

    private cachedParams: Map<string, NodeParam> = new Map();
    params: NodeParam[] = [];

    isDirty = false;
    label: string;
    color: string;
    size: Point;
    inputSlots: JoinPointSlot[];
    outputSlots: JoinPointSlot[];

    constructor(config?: NodeConfig) {
        this.size = new Point(defaultNodeViewConfig.width, defaultNodeViewConfig.height);

        if (config) {
            this.setup(config);
        }
    }

    private setup(config: NodeConfig) {
        this.type = config.type;
        this.inputSlots = config.connections.filter(conn => conn.direction === 'input').map(conn => ({ name: conn.name }));
        this.outputSlots = config.connections.filter(conn => conn.direction === 'output').map(conn => ({ name: conn.name }));
        this.category = config.category;
        this.params = config.params;
        this.params.forEach(param => this.cachedParams.set(param.name, param));
    }

    getParam(name: string): NodeParam {
        return this.cachedParams.get(name);
    }

    setParam(name: string, value: any) {
        this.getParam(name).val = value;
    }

    updateNode(graph: NodeGraph): void {}

    findSlotByName(name: string) {
        return this.inputSlots.find(slot => slot.name === name) || this.outputSlots.find(slot => slot.name === name);
    }

    getAllAdjacentNodes(): NodeObj[] {
        return this.nodeView.joinPointViews
            .filter(joinPointView => joinPointView.getOtherNode() !== undefined)
            .map(joinPointView => joinPointView.getOtherNode().model);
    }

    toJson(): NodeModelJson {
        return {
            type: this.type,
            params: this.params,
            inputSlots: this.inputSlots,
            outputSlots: this.outputSlots,
            label: this.label,
            color: this.color,
            sizeX: this.size.x,
            sizeY: this.size.y,
            category: this.category
        }
    }

    fromJson(json: NodeModelJson, viewMap: Map<string, View>) {
        this.type = <BuiltinNodeType> json.type;
        this.params = json.params;
        this.inputSlots = json.inputSlots;
        this.outputSlots = json.outputSlots;
        this.label = json.label;
        this.color = json.color;
        this.size = new Point(json.sizeX, json.sizeY);
        this.category = json.category;
        this.params.forEach(param => this.cachedParams.set(param.name, param));
    }
}