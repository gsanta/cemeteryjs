import { INodeListener } from "../../../../plugins/canvas_plugins/node_editor/node/INodeListener";
import { PropController } from "../../../plugin/controller/FormController";
import { Registry } from "../../../Registry";
import { NodeObj } from "./NodeObj";

export enum NodeParamRole {
    Port = 'Port',
    InputField = 'InputField',
    InputFieldWithPort = 'InputFieldWithPort',
    Hidden = 'Hidden'
}

export enum NodeParamField {
    TextField = 'TextField',
    NumberField = 'NumberField',
    List = 'List',
    MultiList = 'MultiList',
    Checkbox = 'Checkbox'
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

export interface NodeParamJson {
    name: string;
    val: any;
    field?: NodeParamField;
    port?: PortConfig;
}

export abstract class NodeParam<D = any> {
    protected nodeObj?: NodeObj;

    constructor(nodeObj: NodeObj) {
        this.nodeObj = nodeObj;
    }

    name: string;
    field?: NodeParamField;
    fieldDisabled?: boolean;
    port?: PortConfig;
    controller?: PropController;
    listener?: INodeListener;

    val?: D;
    getVal?(): D {
        const port = this.nodeObj.getPort(this.name);
        if (port && port.hasConnectedPort()) {
            const otherPort = port.getConnectedPorts()[0];
            const otherParam = otherPort.getNodeParam();
            // TODO this is legacy only getVal should remain
            return otherParam.getVal ? otherParam.getVal() : otherParam.val;
        } else {
            return this.val;
        }
    }

    setVal?(val: D);

    toJson?(): NodeParamJson;
    fromJson?(registry: Registry, json: NodeParamJson): void;

    execute?(): void {}

    callConnectedPorts?() {
        this.nodeObj.getPort(this.name).getConnectedPorts().forEach(portObj => {
            //TODO temporary, all executors should be migrated to be on the port rather than on the obj
            if (portObj.getNodeParam().execute) {
                portObj.getNodeParam().execute();
            } else {
                portObj.getNodeObj().executor.execute();
            }
        });
    }
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

export interface PortConfig {
    direction: PortDirection;
    dataFlow: PortDataFlow;
}