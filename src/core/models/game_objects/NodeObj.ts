import { AbstractController } from '../../plugins/controllers/AbstractController';
import { Registry } from '../../Registry';
import { NodeGraph } from '../../services/node/NodeGraph';
import { NodeView } from '../views/NodeView';
import { IGameObj, ObjJson } from './IGameObj';
import { NodeConnectionObj } from './NodeConnectionObj';

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

export interface NodeLink {
    name: string;
}

export interface NodeObjJson extends ObjJson {
    type: string;
    params: NodeParam[];
}

export interface NodeParam {
    name: string;
    val: any;
    inputType: 'textField' | 'list';
    valueType: 'string' | 'number';
    isLink?: 'input' | 'output' | 'both' | 'none';
}

export abstract class NodeObj implements IGameObj {
    id: string;
    nodeView: NodeView;
    type: BuiltinNodeType | string;
    category: string;

    private cachedParams: Map<string, NodeParam> = new Map();
    private params: NodeParam[] = [];

    isDirty = false;
    label: string;
    color: string;
    inputs: NodeLink[] = [];
    outputs: NodeLink[] = [];

    connections: Map<string, NodeConnectionObj> = new Map();

    graph: NodeGraph;

    constructor(nodeGraph: NodeGraph) {
        this.graph = nodeGraph;

        if (this.graph) {
            this.graph.addNode(this);
        }
    }

    getParam(name: string): NodeParam {
        this.checkParam(name);
        return this.cachedParams.get(name);
    }

    getParams(): NodeParam[] {
        return this.params;
    }

    hasParam(name: string): boolean {
        return this.cachedParams.get(name) !== undefined;
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

    addParam(param: NodeParam) {
        this.params.push(param);
        this.cachedParams.set(param.name, param);
    }

    findSlotByName(name: string) {
        return this.inputs.find(slot => slot.name === name) || this.outputs.find(slot => slot.name === name);
    }

    dispose() {}

    toJson(): NodeObjJson {
        return {
            id: this.id,
            type: this.type,
            params: this.params,
        }
    }

    fromJson(json: NodeObjJson, registry: Registry) {
        this.type = <BuiltinNodeType> json.type;
        this.params = json.params;
        this.params.forEach(param => this.cachedParams.set(param.name, param));
    }

    execute(registry: Registry) {}
}