import { INodeListener } from "../../../../plugins/canvas_plugins/node_editor/api/INodeListener";
import { Registry } from "../../../Registry";
import { NodeObj } from "./NodeObj";

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
    portDirection?: PortDirection;
    portDataflow?: PortDataFlow;
}

export abstract class NodeParam<D = any> {
    protected nodeObj?: NodeObj;

    constructor(nodeObj: NodeObj) {
        this.nodeObj = nodeObj;
    }

    name: string;
    portDirection?: PortDirection;
    portDataFlow?: PortDataFlow;
    listener?: INodeListener;
    portVal?: D[];

    ownVal?: D;

    doNotSerialize? = false;

    onPull?(): void;

    getPortOrOwnVal?(): D[] {
        if (this.portDirection === PortDirection.Input && this.portDataFlow === PortDataFlow.Pull && this.nodeObj.getPortForParam(this).hasConnectedPort()) {
            this.portVal = this.nodeObj.getPortForParam(this).pull();
            return this.portVal;
        } else {
            return [this.ownVal];
        }
    }

    setVal?(val: D);

    toJson?(): NodeParamJson;
    fromJson?(registry: Registry, json: NodeParamJson): void;

    execute?(): void {}
}