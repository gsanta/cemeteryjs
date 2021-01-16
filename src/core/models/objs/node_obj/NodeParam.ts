import { INodeListener } from "../../../../plugins/canvas_plugins/node_editor/api/INodeListener";
import { Registry } from "../../../Registry";
import { colors } from "../../../ui_components/react/styles";
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

export enum PortValueType {
    Any = 'Any',
    Boolean = 'Boolean',
    GameObject = 'GameObject'
}

export namespace PortValueType {

    export function getColor(portValueType: PortValueType) {
        switch(portValueType) {
            case PortValueType.Any:
                return colors.grey1;
            case PortValueType.Boolean:
                return colors.green;
            case PortValueType.GameObject:
                return colors.darkorchid;
        }
    }
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

    getHandler?() {
        return this.nodeObj.getPort(this.name);
    }

    name: string;
    portDirection?: PortDirection;
    portDataFlow?: PortDataFlow;
    portValueType?: PortValueType = PortValueType.Any;
    listener?: INodeListener;
    portVal?: D;
    ownVal?: D;

    doNotSerialize? = false;

    onPull?(): void;

    getVal?(): D;

    getPortOrOwnVal?(): D {
        if (this.portDirection === PortDirection.Input && this.portDataFlow === PortDataFlow.Pull && this.nodeObj.getPortForParam(this).hasConnectedPort()) {
            this.portVal = this.nodeObj.getPortForParam(this).pull();
            return this.portVal;
        } else if (this.portDirection === PortDirection.Input && this.nodeObj.getPortForParam(this).hasConnectedPort()) {
            return this.portVal;
        } else {
            return this.ownVal;
        }
    }

    setVal?(val: D);

    toJson?(): NodeParamJson;
    fromJson?(registry: Registry, json: NodeParamJson): void;

    execute?(): void {}
}