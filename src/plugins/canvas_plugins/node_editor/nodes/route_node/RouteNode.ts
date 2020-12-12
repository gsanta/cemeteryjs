import { MeshObj } from "../../../../../core/models/objs/MeshObj";
import { CustomNodeParamSerializer, NodeObj, NodeParam, NodeParamField, NodeParamJson, NodeParams, NodeParamRole, PortDirection, PortDataFlow } from "../../../../../core/models/objs/NodeObj";
import { PathObj } from "../../../../../core/models/objs/PathObj";
import { NodeView } from "../../../../../core/models/views/NodeView";
import { PropContext, PropController } from '../../../../../core/plugin/controller/FormController';
import { UI_Region } from "../../../../../core/plugin/UI_Panel";
import { Registry } from "../../../../../core/Registry";
import { AbstractNodeExecutor } from "../../../../../core/services/node/INodeExecutor";
import { UI_Element } from "../../../../../core/ui_components/elements/UI_Element";
import { AbstractNodeFactory } from "../AbstractNode";
import { RouteWalker } from "./RouteWalker";

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
        nodeView.addParamController(new SpeedControl(nodeView.getObj()));
        nodeView.id = this.registry.data.view.node.generateId(nodeView);

        return nodeView;
    }

    createObj(): NodeObj {
        const obj = new NodeObj(this.nodeType, new RouteNodeParams(), {displayName: this.displayName});
        
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

export class SpeedControl extends PropController<string> {
    private nodeObj: NodeObj<RouteNodeParams>;

    constructor(nodeObj: NodeObj) {
        super();
        this.nodeObj = nodeObj;
    }

    acceptedProps() { return ['speed']; }

    defaultVal(context: PropContext, element: UI_Element) {
        return this.nodeObj.param.speed.val;
    }
    
    change(val, context) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Canvas1);
    }

    blur(context: PropContext, element) {
        const speed = context.getTempVal();
        context.clearTempVal();

        try {
            if (speed) {
                const speedNum = parseFloat(speed);
                this.nodeObj.param.speed.val = speedNum;
            }
        } catch (e) {
            console.log(e);
        }

        const routeWalker = this.nodeObj.param.routeWalker.val as RouteWalker;
        if (routeWalker) {
            routeWalker.setSpeed(this.nodeObj.param.speed.val);
        }

        context.registry.services.history.createSnapshot();
        context.registry.services.render.reRender(UI_Region.Canvas1);
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
            this.nodeObj.setParam('routeWalker', new RouteWalker(meshObj, pathObj));
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
            const nodeParam = nodeObj.getPort('mesh').getConnectedPort().getNodeParam();
            return <MeshObj> registry.data.view.node.getById(nodeParam.val)?.getObj();
        }
    }

    private getPathObj(nodeObj: NodeObj, registry: Registry): PathObj {
        if (nodeObj.getPort('path').hasConnectedPort()) {
            const nodeParam = nodeObj.getPort('path').getConnectedPort().getNodeParam();
            return <PathObj> registry.data.view.node.getById(nodeParam.val)?.getObj();
        }
    }
}