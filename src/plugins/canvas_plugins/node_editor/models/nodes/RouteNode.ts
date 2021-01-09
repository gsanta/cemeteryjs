import { MeshObj } from "../../../../../core/models/objs/MeshObj";
import { NodeObj, NodeParams } from "../../../../../core/models/objs/node_obj/NodeObj";
import { NodeParam, NodeParamField, PortDirection, PortDataFlow } from "../../../../../core/models/objs/node_obj/NodeParam";
import { PathObj } from "../../../../../core/models/objs/PathObj";
import { NodeView } from "../views/NodeView";
import { PropContext, ParamController } from '../../../../../core/controller/FormController';
import { UI_Region } from "../../../../../core/plugin/UI_Panel";
import { Registry } from "../../../../../core/Registry";
import { AbstractNodeExecutor } from "../../../../../core/services/node/INodeExecutor";
import { UI_Element } from "../../../../../core/ui_components/elements/UI_Element";
import { AbstractNodeFactory } from "../../api/AbstractNode";
import { RouteNodeControllers } from "../../controllers/nodes/RouteNodeControllers";
import { RouteWalker } from "../../domain/RouteWalker";

export const RouteNodeObjType = 'route-node-obj';

export class RouteNode extends AbstractNodeFactory {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    nodeType = RouteNodeObjType;
    displayName = 'Route';
    category = 'Default';

    createView(obj: NodeObj): NodeView {
        const nodeView = new NodeView(this.registry);
        nodeView.setObj(obj);
        nodeView.addParamControllers(new RouteNodeControllers(this.registry, obj));
        nodeView.id = this.registry.data.view.node.generateId(nodeView);

        return nodeView;
    }

    createObj(): NodeObj {
        const obj = new NodeObj(this.nodeType, {displayName: this.displayName});
        obj.setParams(new RouteNodeParams());
        obj.executor = new RouteNodeExecutor(this.registry, obj);
        obj.id = this.registry.stores.objStore.generateId(obj.type);
        obj.graph = this.registry.data.helper.node.graph;

        return obj;
    }
}

export class RouteNodeParams extends NodeParams {
    readonly speed: NodeParam = {
        name: 'speed',
        field: NodeParamField.NumberField,
        val: 1,
    }

    readonly routeWalker: NodeParam = {
        name: 'routeWalker',
        val: undefined
    }
    
    readonly onStart: NodeParam = {
        name: 'onStart',
        port: {
            direction: PortDirection.Output,
            dataFlow: PortDataFlow.Push
        }
    }
    
    readonly onTurnStart = {
        name: 'onTurnStart',
        port: {
            direction: PortDirection.Output,
            dataFlow: PortDataFlow.Push
        }
    }
    
    readonly onTurnEnd = {
        name: 'onTurnEnd',
        port: {
            direction: PortDirection.Output,
            dataFlow: PortDataFlow.Push
        }
    }
    
    readonly onFinish = {
        name: 'onFinish',
        port: {
            direction: PortDirection.Output,
            dataFlow: PortDataFlow.Push
        }
    }
    
    readonly mesh = {
        name: 'mesh',
        port: {
            direction: PortDirection.Input,
            dataFlow: PortDataFlow.Push
        }
    }
    
    readonly path = {
        name: 'path',
        port: {
            direction: PortDirection.Input,
            dataFlow: PortDataFlow.Push
        }
    }
}

export class RouteNodeExecutor extends AbstractNodeExecutor<RouteNodeParams> {
    private registry: Registry;

    constructor(registry: Registry, nodeObj: NodeObj) {
        super(nodeObj);
        this.registry = registry;
    }

    execute() {
        const meshObj = this.getMeshObj(this.nodeObj, this.registry);
        const pathObj = this.getPathObj(this.nodeObj, this.registry);

        if (!meshObj || !pathObj) { return; }

        if (!this.nodeObj.param.routeWalker.val) {
            this.nodeObj.setParamVal('routeWalker', new RouteWalker(meshObj, pathObj));
        }

        const routeWalker = <RouteWalker> this.nodeObj.param.routeWalker.val;
        routeWalker.step();
    }

    executeStart() {
        const routeWalker = <RouteWalker> this.nodeObj.param.routeWalker.val;
        routeWalker && routeWalker.start();
    }

    private getMeshObj(nodeObj: NodeObj, registry: Registry): MeshObj {
        if (nodeObj.getPort('mesh').hasConnectedPort()) {
            const nodeParam = nodeObj.getPort('mesh').getConnectedPorts()[0].getNodeParam();
            return <MeshObj> registry.data.view.node.getById(nodeParam.val)?.getObj();
        }
    }

    private getPathObj(nodeObj: NodeObj, registry: Registry): PathObj {
        if (nodeObj.getPort('path').hasConnectedPort()) {
            const nodeParam = nodeObj.getPort('path').getConnectedPorts()[0].getNodeParam();
            return <PathObj> registry.stores.objStore.getById(nodeParam.val);
        }
    }
}