import { MeshObj } from "../../../../../core/models/objs/MeshObj";
import { CustomNodeParamSerializer, NodeObj, NodeParam, NodeParamFieldType, NodeParamJson, NodeParams, NodeParamType } from "../../../../../core/models/objs/NodeObj";
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
        const obj = new NodeObj(this.nodeType, {displayName: this.displayName});
        
        obj.executor = new RouteNodeExecutor(this.registry, obj);
        obj.id = this.registry.stores.objStore.generateId(obj.type);
        obj.graph = this.registry.data.helper.node.graph;
        obj.param = new RouteNodeParams(); 

        return obj;
    }
}

export class RouteNodeParams implements NodeParams {
    speed = {
        name: 'speed',
        type: NodeParamType.InputField,
        fieldType: NodeParamFieldType.NumberField,
        val: 1,
    }

    routeWalker = {
        name: 'routeWalker',
        type: NodeParamType.Hidden,
        val: undefined
    }
    
    onStart = {
        name: 'onStart',
        type: NodeParamType.Port,
        port: 'output'
    }
    
    onTurnStart = {
        name: 'onTurnStart',
        type: NodeParamType.Port,
        port: 'output'
    }
    
    onTurnEnd = {
        name: 'onTurnEnd',
        type: NodeParamType.Port,
        port: 'output'
    }
    
    onFinish = {
        name: 'onFinish',
        type: NodeParamType.Port,
        port: 'output'
    }
    
    mesh = {
        name: 'mesh',
        type: NodeParamType.Port,
        port: 'input'
    }
    
    path = {
        name: 'path',
        type: NodeParamType.Port,
        port: 'input'
    }
}

class RouteNodeSerializer implements CustomNodeParamSerializer {
    serialize(param: NodeParam): NodeParamJson {
        if (param.name === 'routeWalker') {
            return {
                type: NodeParamType.Hidden,
                name: 'routeWalker',
                val: undefined
            }
        }
    }
    
    deserialize(json: NodeParamJson): NodeParam {
        return undefined;
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
        let meshParam = nodeObj.getConnection('mesh') && nodeObj.getConnection('mesh')[0].param.mesh;

        if (meshParam) {
            return <MeshObj> registry.data.view.node.getById(meshParam.val)?.getObj();
        }
    }

    private getPathObj(nodeObj: NodeObj, registry: Registry): PathObj {
        let pathParam = nodeObj.getConnection('path') && nodeObj.getConnection('path')[0].param.path;

        if (pathParam) {
            return <PathObj> registry.data.view.node.getById(pathParam.val)?.getObj();
        }
    }
}