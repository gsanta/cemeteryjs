import { Registry } from '../../Registry';
import { INodeExecutor } from '../../services/node/INodeExecutor';
import { NodeGraph } from '../../services/node/NodeGraph';
import { IObj, ObjJson } from './IObj';

export const NodeObjType = 'node-obj';

export interface NodeObjJson extends ObjJson {
    type: string;
    params: NodeParamJson[];
}

export enum NodeCategory {
    Input = 'Input',
    Boolean = 'Boolean',
    Default = 'Default'
}

export interface NodeParamJson {
    name: string;
    val: any;
    uiOptions?: {
        inputType: 'textField' | 'list';
        valueType: 'string' | 'number';
    }
    [otherData: string]: any;
    port?: 'input' | 'output';
}

export interface NodeParam<T = undefined> {
    name: string;
    val?: any;
    uiOptions?: {
        inputType: 'textField' | 'list';
        valueType: 'string' | 'number';
    }
    port?: 'input' | 'output';

    getVal?();
    setVal?(val: string);

    toJson?(): NodeParamJson;
    fromJson?(json: NodeObjJson);
}

export interface NodeParams {
    getParam(name: string): NodeParam;
    getParams(): NodeParam[];
    hasParam(name: string): boolean;
    setParam(name: string, value: any);
}

/**
 * It should be implemented and passed to a {@link NodeObj} when some of the params of the {@link NodeObj} contains
 * a non-primitive value (e.g some custom object), so that it's serialization/deserialization can be done through this interface.
 */
export interface CustomNodeParamSerializer {
    /**
     * It will be called for every {@link NodeParam} in the {@link NodeObj}.
     * 
     *  @returns the serialized {@link NodeParam}, or for primitive values undefined can be returned and then the defult serializer will run.
     */
    serialize(param: NodeParam): NodeParamJson;
    /**
     * It will be called for every {@link NodeParamJson} when deserializing a {@link NodeObj}.
     * 
     *  @returns the deserialized {@link NodeParam}, or for primitive values undefined can be returned and then the defult deserializer will run.
     */
    deserialize(json: NodeParamJson): NodeParam;
}

export interface NodeObjConfig {
    displayName?: string;
    category?: string;
    customParamSerializer?: CustomNodeParamSerializer;
}

export class NodeObj implements IObj {
    id: string;
    objType = NodeObjType;
    type: string;
    displayName: string;
    category: string;
    color: string;

    // params: P;

    // inputs: NodeParam[] = [];
    // outputs: NodeParam[] = [];
    private connections: Map<string, [NodeObj, string]> = new Map();
    isExecutionStopped = true;
    executor: INodeExecutor;

    params: {[key: string]: NodeParam} = {};

    graph: NodeGraph;

    private paramList: NodeParam[] = [];
    private customParamSerializer: CustomNodeParamSerializer;

    constructor(nodeType: string, config?: NodeObjConfig) {
        this.type = nodeType;
        if (config) {
            this.customParamSerializer = config.customParamSerializer;
            this.category = config.category || NodeCategory.Default;
            this.displayName = config.displayName || nodeType;
        }
    }

    execute() {
        this.executor && this.executor.execute();
    }

    startExecution() {
        this.executor && this.executor.executeStart && this.executor.executeStart();
    }

    stopExecution() {
        this.executor && this.executor.executeStart && this.executor.executeStop();
    }

    getParam(name: string): NodeParam {
        return this.params[name];
    }

    getParams(): NodeParam[] {
        return this.paramList;
    }

    hasParam(name: string): boolean {
        return this.params[name] !== undefined; 
    }

    setParam(name: string, value: any) {
        this.params[name].val = value;
    }

    addParam(param: NodeParam) {
        this.params[param.name] = param;
        this.paramList.push(param);
    }

    getConnection(portName: string): [NodeObj, string] {
        return this.connections.get(portName);
    }

    getConnections(): [NodeObj, string][] {
        return Array.from(this.connections.values());
    }

    deleteConnection(port: string) {
        const connection = this.connections.get(port);

        if (connection) {
            this.connections.delete(port);
            connection[0].deleteConnection(connection[1]);
            this.graph.onDisconnect([this, port], connection);
        }
    }

    addConnection(port: string, otherNode: NodeObj, otherPort: string) {
        this.connections.set(port, [otherNode, otherPort]);
        this.graph.onConnect([this, port], [otherNode, otherPort]);
    }

    addAllParams(params: NodeParam[]) {
        params.forEach(param => this.addParam(param));
    }

    findSlotByName(name: string) {
        return this.getInputPorts().find(slot => slot.name === name) || this.getOutputPorts().find(slot => slot.name === name);
    }

    getInputPorts() {
        return this.paramList.filter(param => param.port === 'input');
    }

    getOutputPorts() {
        return this.paramList.filter(param => param.port === 'output');
    }

    getUIParams() {
        return this.paramList.filter(param => param.uiOptions);
    }

    dispose() {
        this.getConnections().forEach(([NodeObj, portName]) => this.deleteConnection(portName));
    }

    clone(): NodeObj {
        throw new Error('not implemented');
    }

    serialize(): NodeObjJson {
        const params = this.paramList.map(param => this.customParamSerializer && this.customParamSerializer.serialize(param) || defaultNodeParamSerializer(param));

        return {
            id: this.id,
            objType: this.objType,
            type: this.type,
            params: params,
        }
    }

    deserialize(json: NodeObjJson, registry: Registry): void {

        this.id = json.id;
        this.type = json.type;
        this.paramList = json.params.map(jsonParam => this.customParamSerializer && this.customParamSerializer.deserialize(jsonParam) || defaultNodeParamDeserializer(jsonParam));
        this.paramList.forEach(param => this.params[param.name] = param);
    }
}

function defaultNodeParamSerializer(param: NodeParam): NodeParamJson {
    const uiOptions = param.uiOptions ? param.uiOptions : undefined;
    return {
        name: param.name,
        val: param.val,
        uiOptions: uiOptions,
        port: param.port
    }
}

function defaultNodeParamDeserializer(json: NodeParamJson): NodeParam {
    return {
        name: json.name,
        val: json.val,
        uiOptions: json.uiOptions,
        port: json.port
    }
}