import { Registry } from '../../../Registry';
import { AbstractNodeExecutor } from '../../../services/node/INodeExecutor';
import { NodeGraph } from '../../../services/node/NodeGraph';
import { IObj, ObjJson } from '../IObj';
import { NodeObjDeserialize } from './NodeObjDeserializer';
import { NodeObjSerializer } from './NodeObjSerializer';
import { NodePortObj, NodePortObjJson } from '../NodePortObj';
import { NodeParamJson, NodeParam } from './NodeParam';
import { INodeListener } from '../../../../modules/graph_editor/main/api/INodeListener';
import { Canvas3dPanel } from '../../modules/Canvas3dPanel';

export const NodeObjType = 'node-obj';

export interface NodeObjJson extends ObjJson {
    type: string;
    params: NodeParamJson[];
    ports: NodePortObjJson[];
}

export enum NodeCategory {
    Input = 'Input',
    Boolean = 'Boolean',
    Default = 'Default'
}

export abstract class NodeParams {
    [id: string] : NodeParam;
}

export interface NodeObjConfig {
    displayName?: string;
    category?: string;
}

export class NodeObj<P extends NodeParams = any> implements IObj {
    objType = NodeObjType;
    id: string;
    name: string;
    type: string;
    displayName: string;
    category: string;
    color: string;

    param: P;
    listener: INodeListener;
    paramList: NodeParam[];

    isExecutionStopped = true;
    executor: AbstractNodeExecutor<any>;

    graph: NodeGraph;
    canvas: Canvas3dPanel;

    private ports: Map<string, NodePortObj> = new Map();


    constructor(nodeType: string, canvas: Canvas3dPanel, config?: NodeObjConfig) {
        this.type = nodeType;
        this.canvas = canvas;
        if (config) {
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

    setParams(params: P) {
        this.param = params;
        this.initParams();
    }

    getParams(): NodeParam[] {
        return this.paramList;
    }

    setParamVal(name: string, value: any) {
        this.param[name].ownVal = value;
    }

    getPort(portName: string): NodePortObj {
        return this.ports.get(portName);
    }

    getPortForParam(param: NodeParam): NodePortObj {
        return this.getPorts().find(port => port.getNodeParam() === param);
    }


    getPorts(): NodePortObj[] {
        return Array.from(this.ports.values());
    }

    // pullData(portName: string): any {
    //     // TODO check that port is output port
    //     if (this.getPort(portName).hasConnectedPort()) {
    //         const param = this.getPort(portName).getConnectedPorts()[0].getNodeParam();

    //         if (param.getVal) {
    //             return param.getVal();
    //         } else {
    //             return param.ownVal;
    //         }
    //     }
    // }

    dispose() {
        this.getPorts().forEach(portObj => portObj.dispose());
    }

    clone(): NodeObj {
        throw new Error('not implemented');
    }

    serialize(): NodeObjJson {
        return new NodeObjSerializer(this).serialize();
    }

    deserialize(json: NodeObjJson, registry: Registry): void {
        new NodeObjDeserialize(this).deserialize(json, registry);
    }

    initParams() {
        this.paramList = [];
        Object.entries(this.param).forEach(entry => this.paramList.push(entry[1]));

        const currentPorts = this.ports;
        this.ports = new Map();

        this.paramList
            .filter(param => param.portDirection)
            .forEach(port => {
                if (currentPorts.has(port.name)) {
                    this.ports.set(port.name, currentPorts.get(port.name));
                    currentPorts.delete(port.name);
                } else {
                    this.ports.set(port.name, new NodePortObj(this, port, this.canvas))
                }
            });
        Array.from(currentPorts.values()).forEach(port => port.dispose());
    }
}