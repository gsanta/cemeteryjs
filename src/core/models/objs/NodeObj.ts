import { Registry } from '../../Registry';
import { NodeGraph } from '../../services/node/NodeGraph';
import { IObj, ObjFactory, ObjJson } from './IObj';
import { NodeConnectionObj } from './NodeConnectionObj';

export const NodeObjType = 'node-obj';

export interface NodeObjJson extends ObjJson {
    type: string;
    params: NodeParam[];
}

export class NodeObjFactory implements ObjFactory {
    private registry: Registry;

    objType = NodeObjType;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    newInstance() {
        return this.registry.services.node.createNodeObj();
    }
}

export enum NodeCategory {
    Input = 'Input',
    Boolean = 'Boolean',
    Default = 'Default'
}

export interface NodeLink {
    name: string;
}


export interface NodeParam {
    name: string;
    val: any;
    inputType: 'textField' | 'list';
    valueType: 'string' | 'number';
    isLink?: 'input' | 'output' | 'both' | 'none';
}

export abstract class NodeObj implements IObj {
    id: string;
    objType = NodeObjType;
    type: string;
    displayName: string;
    category: string;
    color: string;

    inputs: NodeLink[] = [];
    outputs: NodeLink[] = [];
    connections: Map<string, NodeConnectionObj> = new Map();
    graph: NodeGraph;
    
    private cachedParams: Map<string, NodeParam> = new Map();
    private params: NodeParam[] = [];

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
        this.id = json.id;
        this.type = json.type;
        this.params = json.params;
        this.params.forEach(param => this.cachedParams.set(param.name, param));
    }

    execute(registry: Registry) {}
}