import { Registry } from '../../Registry';
import { AbstractNodeExecutor } from '../../services/node/INodeExecutor';
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

export enum NodeParamRole {
    Port = 'Port',
    InputField = 'InputField',
    InputFieldWithPort = 'InputFieldWithPort',
    Hidden = 'Hidden'
}

export enum NodeParamField {
    TextField = 'TextField',
    NumberField = 'NumberField',
    List = 'List'
}

export enum NodePortType {
    Mesh = 'Mesh',
    Signal = 'Signal'
}

export enum PortDirection {
    Input = 'Input',
    Output = 'Output'
}
export enum PortDataFlow {
    Pull = 'Pull',
    Push = 'Push'
}

export interface PortConfig {
    direction: PortDirection;
    dataFlow: PortDataFlow;
}

export interface NodeParamJson {
    name: string;
    val: any;
    field?: NodeParamField;
    port?: PortConfig;
}

export interface NodeParam {
    name: string;
    field?: NodeParamField;
    port?: PortConfig;

    val?: any;
    getVal?();
    setVal?(val: string);

    toJson?(): NodeParamJson;
    fromJson?(json: NodeObjJson);
}

export namespace NodeParam {
    export function getStandaloneInputPorts(nodeObj: NodeObj): NodeParam[] {
        return NodeParam.getInputPorts(nodeObj).filter(param => !param.field);
    }
    
    export function getInputPorts(nodeObj: NodeObj): NodeParam[] {
        return nodeObj.getParams().filter(param => param.port && param.port.direction === PortDirection.Input);
    }

    export function getStandaloneOutputPorts(nodeObj: NodeObj): NodeParam[] {
        return NodeParam.getOutputPorts(nodeObj).filter(param => !param.field);
    }
    
    export function getOutputPorts(nodeObj: NodeObj): NodeParam[] {
        return nodeObj.getParams().filter(param => param.port && param.port.direction === PortDirection.Output);
    }

    export function getFieldParams(nodeObj: NodeObj): NodeParam[] {
        return nodeObj.getParams().filter(param => param.field);
    }

    export function isStandalonePort(param: NodeParam) {
        return param.port && !param.field;
    }

    export function isPort(param: NodeParam) {
        return param.port;
    }

    export function isFieldParam(param: NodeParam) {
        return param.field;
    }
}

export abstract class NodeParams {
    [id: string] : NodeParam;
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

export class NodeObj<P extends NodeParams = any> implements IObj {
    id: string;
    objType = NodeObjType;
    type: string;
    displayName: string;
    category: string;
    color: string;

    param: P;
    paramList: NodeParam[];

    private connections: Map<string, [NodeObj, string]> = new Map();
    isExecutionStopped = true;
    executor: AbstractNodeExecutor<any>;

    graph: NodeGraph;

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

    getParams(): NodeParam[] {
        if (!this.paramList) { this.cacheParams(); }

        return this.paramList;
    }

    getParam(name: string): NodeParam {
        return this.param[name];
    }

    setParam(name: string, value: any) {
        this.param[name].val = value;
    }

    // addParam(param: NodeParam) {
    //     this.params[param.name] = param;
    //     this.paramList.push(param);
    // }

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

    dispose() {
        this.getConnections().forEach(([NodeObj, portName]) => this.deleteConnection(portName));
    }

    clone(): NodeObj {
        throw new Error('not implemented');
    }

    serialize(): NodeObjJson {
        const params = this.getParams().map(param => {
            return this.customParamSerializer && this.customParamSerializer.serialize(param) || defaultNodeParamSerializer(param);
        });

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
        const paramList = json.params.map(jsonParam => this.customParamSerializer && this.customParamSerializer.deserialize(jsonParam) || defaultNodeParamDeserializer(jsonParam));
        // paramList.forEach(param => (this.param as Nodeparams[param.name] = param);
    }

    private cacheParams() {
        this.paramList = [];
        Object.entries(this.param).forEach(entry => this.paramList.push(entry[1]));
    }
}

function defaultNodeParamSerializer(param: NodeParam): NodeParamJson {
    const json: NodeParamJson = {
        name: param.name,
        val: param.val,
        field: param.field,
    }

    if (param.field) {
        json.field = param.field;
    }

    if (param.port) {
        json.port = {
            direction: param.port.direction,
            dataFlow: param.port.dataFlow
        }
    }

    return json;
}

function defaultNodeParamDeserializer(json: NodeParamJson): NodeParam {
    const param: NodeParam = {
        name: json.name,
        val: json.val,
    }

    if (json.field) {
        param.field = json.field;
    }

    if (json.port) {
        param.port = {
            direction: json.port.direction,
            dataFlow: json.port.dataFlow
        }
    }

    return param;
}