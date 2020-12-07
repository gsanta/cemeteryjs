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

export enum NodeParamType {
    Port = 'Port',
    InputField = 'InputField',
    InputFieldWithPort = 'InputFieldWithPort',
    Hidden = 'Hidden'
}

export enum NodeParamFieldType {
    TextField = 'TextField',
    NumberField = 'NumberField',
    List = 'List'
}


export interface NodeParamJson {
    name: string;
    type: NodeParamType;
    val: any;
    fieldType?: NodeParamFieldType;
    port?: 'input' | 'output';
}

export interface NodeParam {
    name: string;
    type: NodeParamType;
    fieldType?: NodeParamFieldType;
    port?: 'input' | 'output';
    
    val?: any;
    getVal?();
    setVal?(val: string);

    toJson?(): NodeParamJson;
    fromJson?(json: NodeObjJson);
}

export interface NodeParams {
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
    cachedParams: Map<string, NodeParam> = undefined;
    private paramList: NodeParam[];

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
        if (!this.cachedParams) { this.cacheParams(); }

        return Array.from(this.cachedParams.values());;
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

    findSlotByName(name: string) {
        return this.getInputPorts().find(slot => slot.name === name) || this.getOutputPorts().find(slot => slot.name === name);
    }

    getInputPorts() {
        if (!this.cachedParams) { this.cacheParams(); }

        return this.paramList.filter(param => param.port === 'input');
    }

    getOutputPorts() {
        return this.paramList.filter(param => param.port === 'output');
    }

    getUIParams() {
        return this.paramList.filter(param => param.type === NodeParamType.InputField || param.type === NodeParamType.InputFieldWithPort);
    }

    dispose() {
        this.getConnections().forEach(([NodeObj, portName]) => this.deleteConnection(portName));
    }

    clone(): NodeObj {
        throw new Error('not implemented');
    }

    serialize(): NodeObjJson {
        const params = Array.from(this.cachedParams.entries()).map(([key, param]) => {
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
        paramList.forEach(param => this.param[param.name] = param);
    }

    private cacheParams() {
        const map: Map<string, NodeParam> = new Map();

        const paramTypes =  Object.keys(NodeParamType).map(key => NodeParamType[key]).filter(k => !(parseInt(k) >= 0));

        Object.entries(this.param).forEach(entry => {
            if (entry[1].type && paramTypes.includes(entry[1].type)) {
                map.set(entry[0], entry[1]);
            }
        });
    
        this.paramList = Array.from(map.values());
        this.cachedParams = map;
    }
}

function defaultNodeParamSerializer(param: NodeParam): NodeParamJson {
    return {
        type: param.type,
        name: param.name,
        val: param.val,
        fieldType: param.fieldType,
        port: param.port
    }
}

function defaultNodeParamDeserializer(json: NodeParamJson): NodeParam {
    return {
        type: json.type,
        name: json.name,
        val: json.val,
        fieldType: json.fieldType,
        port: json.port
    }
}