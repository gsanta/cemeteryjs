import { NodeObj, NodeParam, BuiltinNodeType, NodeCategory } from "../../../core/models/game_objects/NodeObj";
import { Registry } from "../../../core/Registry";
import { AbstractController, PropControl } from "../../../core/plugins/controllers/AbstractController";
import { NodeGraph } from "../../../core/services/node/NodeGraph";
import { MeshObj } from "../../../core/models/game_objects/MeshObj";
import { PathObj } from "../../../core/models/game_objects/PathObj";
import { RouteWalker } from "./RouteWalker";
import { NodeView } from "../../../core/models/views/NodeView";
import { UI_Region } from "../../../core/plugins/UI_Plugin";

export const RouteNodeObjType = 'route-node-obj';
export class RouteNodeObj extends NodeObj {
    type = RouteNodeObjType;
    category = NodeCategory.Default;

    private routeNodeExecutor: RouteNodeExecutor;

    constructor(nodeGraph: NodeGraph) {
        super(nodeGraph);

        this.routeNodeExecutor = new RouteNodeExecutor(this);
    }
    
    params: NodeParam[] = [
        {
            name: 'speed',
            val: '',
            inputType: 'textField',
            valueType: 'number'
        }
    ];

    inputs = [
        {
            name: 'mesh'
        },
        {
            name: 'path'
        }
    ];

    outputs = [
        {
            name: 'onStart'
        },
        {
            name: 'onTurnStart'
        },
        {
            name: 'onTurnEnd'
        },
        {
            name: 'onFinish'
        }
    ];

    execute(registry: Registry) {
        if (this.connections.get('mesh') && this.connections.get('path')) {
            this.routeNodeExecutor.execute(registry);
        }
    }

    newInstance(graph: NodeGraph): NodeObj {
        return new RouteNodeObj(graph);
    }

    newControllerInstance(registry: Registry): AbstractController {
        const controller = new AbstractController(null, registry);
        return controller;    
    }
}

const SpeedControl: PropControl<string> = {
    defaultVal(context, element) {
        const nodeView = context.registry.stores.nodeStore.getById(element.target) as NodeView;
        return nodeView.obj.getParam('speed');
    },
    
    change(val, context) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Canvas1);
    },

    blur(context, element) {
        const speed = context.getTempVal();
        context.clearTempVal();

        try {
            const speedNum = parseFloat(speed);
            const nodeView = context.registry.stores.nodeStore.getById(element.target) as NodeView;
            nodeView.obj.setParam('speed', speedNum);
        } catch (e) {
            console.log(e);
        }
    }
}


class RouteNodeExecutor {

    private node: RouteNodeObj;
    private registry: Registry;
    private routWalker: RouteWalker;

    constructor(node: RouteNodeObj) {
        this.node = node;
    }

    execute(registry: Registry) {
        const meshObj = this.getMeshObj(registry);
        const pathObj = this.getPathObj(registry);

        if (!meshObj || !pathObj) { return; }

        if (!this.routWalker) {
            this.routWalker = new RouteWalker(meshObj, pathObj);
        }

        this.routWalker.step();
    }

    private getMeshObj(registry: Registry): MeshObj {
        let meshParam = this.node.connections.get('mesh') && this.node.connections.get('mesh').getOtherNode(this.node).getParam('mesh');

        if (meshParam) {
            return <MeshObj> registry.stores.canvasStore.getById(meshParam.val)?.obj;
        }
    }

    private getPathObj(registry: Registry): PathObj {
        let pathParam = this.node.connections.get('path') && this.node.connections.get('path').getOtherNode(this.node).getParam('path');

        if (pathParam) {
            return <PathObj> registry.stores.canvasStore.getById(pathParam.val)?.obj;
        }
    }
}