import { Point } from '../../../utils/geometry/shapes/Point';
import { Registry } from '../../Registry';
import { NodeGraph } from '../../services/node/NodeGraph';
import { defaultNodeViewConfig, NodeView } from '../views/NodeView';
import { IGameObj, ObjJson } from './IGameObj';
import { AbstractController } from '../../plugins/controllers/AbstractController';

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

export interface NodeModelJson extends ObjJson {
    type: string;
    params: NodeParam[];
    inputs: JoinPointSlot[];
    outputs: JoinPointSlot[];
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

export abstract class NodeObj implements IGameObj {
    id: string;
    nodeView: NodeView;
    type: BuiltinNodeType | string;
    category: string;

    private cachedParams: Map<string, NodeParam> = new Map();
    params: NodeParam[];

    isDirty = false;
    label: string;
    color: string;
    size: Point;
    inputs: JoinPointSlot[] = [];
    outputs: JoinPointSlot[] = [];

    controller: AbstractController;
    graph: NodeGraph;

    constructor(nodeGraph: NodeGraph) {
        this.size = new Point(defaultNodeViewConfig.width, defaultNodeViewConfig.height);
        this.graph = nodeGraph;

        if (this.graph) {
            this.graph.addNode(this);
        }
    }

    getParam(name: string): NodeParam {
        this.checkParam(name);
        return this.cachedParams.get(name);
    }

    private checkParam(name: string) {
        if (this.cachedParams.get(name) === undefined) {
            const param = this.params.find(param => param.name === name);

            if (!param) {
                throw new Error(`Param name ${name} does not exist in node obj type ${this.type}`);
            }

            this.cachedParams.set(param.name, param);
        }
    }

    setParam(name: string, value: any) {
        this.getParam(name).val = value;
    }

    findSlotByName(name: string) {
        return this.inputs.find(slot => slot.name === name) || this.outputs.find(slot => slot.name === name);
    }

    toJson(): NodeModelJson {
        return {
            id: this.id,
            type: this.type,
            params: this.params,
            inputs: this.inputs,
            outputs: this.outputs,
            label: this.label,
            color: this.color,
            sizeX: this.size.x,
            sizeY: this.size.y,
            category: this.category
        }
    }

    fromJson(json: NodeModelJson) {
        this.type = <BuiltinNodeType> json.type;
        this.params = json.params;
        this.inputs = json.inputs;
        this.outputs = json.outputs;
        this.label = json.label;
        this.color = json.color;
        this.size = new Point(json.sizeX, json.sizeY);
        this.category = json.category;
        this.params.forEach(param => this.cachedParams.set(param.name, param));
    }

    execute(registry: Registry) {}

    abstract newInstance(graph: NodeGraph): NodeObj;
    abstract newControllerInstance(registry: Registry): AbstractController;
}