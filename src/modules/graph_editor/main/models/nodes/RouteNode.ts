import { MeshObj } from "../../../../../core/models/objs/MeshObj";
import { NodeObj, NodeParams } from "../../../../../core/models/objs/node_obj/NodeObj";
import { NodeParam, PortDataFlow, PortDirection } from "../../../../../core/models/objs/node_obj/NodeParam";
import { PathObj } from "../../../../../core/models/objs/PathObj";
import { Registry } from "../../../../../core/Registry";
import { AbstractNodeExecutor } from "../../../../../core/services/node/INodeExecutor";
import { AbstractNodeFactory } from "../../api/AbstractNode";
import { RouteNodeControllers } from "../../controllers/nodes/RouteNodeControllers";
import { RouteWalker } from "../../controllers/domain/RouteWalker";
import { NodeShape } from "../shapes/NodeShape";

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

    createView(obj: NodeObj): NodeShape {
        const nodeView = new NodeShape(this.registry);
        nodeView.setObj(obj);
        nodeView.addParamControllers(new RouteNodeControllers(this.registry, obj));
        nodeView.id = this.registry.data.node.items.generateId(nodeView);

        return nodeView;
    }

    createObj(): NodeObj {
        const obj = new NodeObj(this.nodeType, {displayName: this.displayName});
        obj.setParams(new RouteNodeParams());
        obj.executor = new RouteNodeExecutor(this.registry, obj);
        obj.id = this.registry.stores.objStore.generateId(obj);
        obj.graph = this.registry.data.helper.node.graph;

        return obj;
    }
}

export class RouteNodeParams extends NodeParams {
    readonly speed: NodeParam = {
        name: 'speed',
        ownVal: 1,
    }

    readonly routeWalker: NodeParam = {
        name: 'routeWalker',
        ownVal: undefined
    }
    
    readonly onStart: NodeParam = {
        name: 'onStart',
        portDirection: PortDirection.Output,
        portDataFlow: PortDataFlow.Push
    }
    
    readonly onTurnStart: NodeParam = {
        name: 'onTurnStart',
        portDirection: PortDirection.Output,
        portDataFlow: PortDataFlow.Push
    }
    
    readonly onTurnEnd: NodeParam = {
        name: 'onTurnEnd',
        portDirection: PortDirection.Output,
        portDataFlow: PortDataFlow.Push
    }
    
    readonly onFinish: NodeParam = {
        name: 'onFinish',
        portDirection: PortDirection.Output,
        portDataFlow: PortDataFlow.Push
    }
    
    readonly mesh: NodeParam = {
        name: 'mesh',
        portDirection: PortDirection.Input,
        portDataFlow: PortDataFlow.Push
    }
    
    readonly path: NodeParam = {
        name: 'path',
        portDirection: PortDirection.Input,
        portDataFlow: PortDataFlow.Push
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

        if (!this.nodeObj.param.routeWalker.ownVal) {
            this.nodeObj.setParamVal('routeWalker', new RouteWalker(meshObj, pathObj));
        }

        const routeWalker = <RouteWalker> this.nodeObj.param.routeWalker.ownVal;
        routeWalker.step();
    }

    executeStart() {
        const routeWalker = <RouteWalker> this.nodeObj.param.routeWalker.ownVal;
        routeWalker && routeWalker.start();
    }

    private getMeshObj(nodeObj: NodeObj, registry: Registry): MeshObj {
        if (nodeObj.getPort('mesh').hasConnectedPort()) {
            const nodeParam = nodeObj.getPort('mesh').getConnectedPorts()[0].getNodeParam();
            return <MeshObj> registry.data.node.items.getItemById(nodeParam.ownVal)?.getObj();
        }
    }

    private getPathObj(nodeObj: NodeObj, registry: Registry): PathObj {
        if (nodeObj.getPort('path').hasConnectedPort()) {
            const nodeParam = nodeObj.getPort('path').getConnectedPorts()[0].getNodeParam();
            return <PathObj> registry.stores.objStore.getItemById(nodeParam.ownVal);
        }
    }
}