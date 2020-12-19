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

export interface NodeParam<D = any> {
    name: string;
    field?: NodeParamField;
    fieldDisabled?: boolean;
    port?: PortConfig;
    controller?: PropController;

    val?: D;
    getData?(nodeObj: NodeObj, registry: Registry): D;
    setVal?(val: string);

    toJson?(): NodeParamJson;
    fromJson?(registry: Registry, json: NodeParamJson): void;
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
    listener?: INodeListener;
    execute?: (nodeObj: NodeObj, registry: Registry) => void;
}