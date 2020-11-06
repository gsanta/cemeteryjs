import { Registry } from '../../Registry';
import { INodeExecutor } from '../../services/node/INodeExecutor';
import { IObj, ObjFactory, ObjJson } from './IObj';
import { NodeConnectionObj } from './NodeConnectionObj';

export const NodeObjType = 'node-obj';

export interface NodeObjJson extends ObjJson {
    type: string;
    params: NodeParamJson[];
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

export interface NodeParamJson {
    name: string;
    val: any;
    uiOptions?: {
        inputType: 'textField' | 'list';
        valueType: 'string' | 'number';
    }
    [otherData: string]: any;
    isLink: 'input' | 'output' | 'both' | 'none';
}

export interface NodeParam {
    name: string;
    val: any;
    uiOptions?: {
        inputType: 'textField' | 'list';
        valueType: 'string' | 'number';
    }
    isLink?: 'input' | 'output' | 'both' | 'none';

    toJson?(): NodeParamJson;
    fromJson?(json: NodeObjJson);
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

    inputs: NodeLink[] = [];
    outputs: NodeLink[] = [];
    connections: Map<string, NodeConnectionObj> = new Map();
    isExecutionStopped = true;
    executor: INodeExecutor;
    
    private cachedParams: Map<string, NodeParam> = new Map();
    private params: NodeParam[] = [];
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
        this.executor && this.executor.execute(this);
    }

    startExecution() {
        this.executor && this.executor.executeStart && this.executor.executeStart(this);
    }

    stopExecution() {
        this.executor && this.executor.executeStart && this.executor.executeStop(this);
    }

    getParam(name: string): NodeParam {
        return this.cachedParams.get(name);
    }

    getParams(): NodeParam[] {
        this.checkParam(name);
        return this.params;
    }

    hasParam(name: string): boolean {
        return this.cachedParams.get(name) !== undefined;
    }

    private checkParam(name: string) {
        if (this.cachedParams.get(name) === undefined) {
            const param = this.params.find(param => param.name === name);

            if (param) {
                this.cachedParams.set(param.name, param);
            }
        }
    }

    setParam(name: string, value: any) {
        this.getParam(name).val = value;
    }

    addParam(param: NodeParam) {
        this.params.push(param);
        this.cachedParams.set(param.name, param);
    }

    addAllParams(params: NodeParam[]) {
        params.forEach(param => this.addParam(param));
    }

    findSlotByName(name: string) {
        return this.inputs.find(slot => slot.name === name) || this.outputs.find(slot => slot.name === name);
    }

    dispose() {}

    serialize(): NodeObjJson {
        const params = this.params.map(param => this.customParamSerializer && this.customParamSerializer.serialize(param) || defaultNodeParamSerializer(param));

        return {
            id: this.id,
            type: this.type,
            params: params,
        }
    }

    deserialize(json: NodeObjJson, registry: Registry): void {

        this.id = json.id;
        this.type = json.type;
        this.params = json.params.map(jsonParam => this.customParamSerializer && this.customParamSerializer.deserialize(jsonParam) || defaultNodeParamDeserializer(jsonParam));
        this.params.forEach(param => this.cachedParams.set(param.name, param));
    }
}

function defaultNodeParamSerializer(param: NodeParam): NodeParamJson {
    const uiOptions = param.uiOptions ? param.uiOptions : undefined;
    return {
        name: param.name,
        val: param.val,
        uiOptions: uiOptions,
        isLink: param.isLink
    }
}

function defaultNodeParamDeserializer(json: NodeParamJson): NodeParam {
    return {
        name: json.name,
        val: json.val,
        uiOptions: json.uiOptions,
        isLink: json.isLink
    }
}