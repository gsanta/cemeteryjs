import { MeshObj } from "../../../../../core/models/objs/MeshObj";
import { NodeCategory, NodeObj, NodeParam } from "../../../../../core/models/objs/NodeObj";
import { PathObj } from "../../../../../core/models/objs/PathObj";
import { NodeView } from "../../../../../core/models/views/NodeView";
import { PropContext, PropController } from "../../../../../core/plugin/controller/FormController";
import { UI_Region } from "../../../../../core/plugin/UI_Plugin";
import { Registry } from "../../../../../core/Registry";
import { INodeExecutor } from "../../../../../core/services/node/INodeExecutor";
import { NodeGraph } from "../../../../../core/services/node/NodeGraph";
import { NodeFactory } from "../../../../../core/services/NodeService";
import { UI_Element } from "../../../../../core/ui_components/elements/UI_Element";
import { RouteWalker } from "./RouteWalker";

export const RouteNodeFacotry: NodeFactory = {
    createNodeObj(graph: NodeGraph): NodeObj {
        return new RouteNodeObj(graph);
    },

    createPropControllers(): PropController[] {
        return [new SpeedControl()];
    },

    createExecutor(): INodeExecutor {
        return new RouteNodeExecutor();
    }
}

const params: NodeParam[] = [
    {
        name: 'speed',
        val: 1,
        uiOptions: {
            inputType: 'textField',
            valueType: 'number'
        }
    },
    {
        name: 'routeWalker',
        val: undefined
    },
];

export const RouteNodeObjType = 'route-node-obj';
export class RouteNodeObj extends NodeObj {
    type = RouteNodeObjType;
    category = NodeCategory.Default;
    displayName = 'Route';

    constructor(nodeGraph: NodeGraph) {
        super(nodeGraph);

        this.addAllParams(params);
    }

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

    setParam(name: string, value: any) {
        super.setParam(name, value);
    }
}

function serializer(nodeParam: NodeParam) {
    if (nodeParam.name === 'routeWalker') {

    }
}

export class SpeedControl extends PropController<string> {
    acceptedProps() { return ['speed']; }

    defaultVal(context: PropContext, element: UI_Element) {
        const nodeView = context.registry.stores.views.getById(element.targetId) as NodeView;
        return nodeView.getObj().getParam('speed').val;
    }
    
    change(val, context) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Canvas1);
    }

    blur(context, element) {
        const speed = context.getTempVal();
        context.clearTempVal();

        try {
            if (speed) {
                const speedNum = parseFloat(speed);
                const nodeView = context.registry.stores.views.getById(element.target) as NodeView;
                nodeView.getObj().setParam('speed', speedNum);
            }
        } catch (e) {
            console.log(e);
        }
    }
}


export class RouteNodeExecutor implements INodeExecutor {
    execute(nodeObj: NodeObj, registry: Registry) {
        const meshObj = this.getMeshObj(nodeObj, registry);
        const pathObj = this.getPathObj(nodeObj, registry);

        if (!meshObj || !pathObj) { return; }

        if (!nodeObj.getParam('routeWalker').val) {
            nodeObj.setParam('routeWalker', new RouteWalker(meshObj, pathObj));
        }

        const routeWalker = <RouteWalker> nodeObj.getParam('routeWalker').val;
        routeWalker.step();
    }

    executeStart(nodeObj: NodeObj, registry: Registry) {
        const routeWalker = <RouteWalker> nodeObj.getParam('routeWalker').val;
        routeWalker && routeWalker.start();
    }

    private getMeshObj(nodeObj: NodeObj, registry: Registry): MeshObj {
        let meshParam = nodeObj.connections.get('mesh') && nodeObj.connections.get('mesh').getOtherNode(nodeObj).getParam('mesh');

        if (meshParam) {
            return <MeshObj> registry.stores.views.getById(meshParam.val)?.getObj();
        }
    }

    private getPathObj(nodeObj: NodeObj, registry: Registry): PathObj {
        let pathParam = nodeObj.connections.get('path') && nodeObj.connections.get('path').getOtherNode(nodeObj).getParam('path');

        if (pathParam) {
            return <PathObj> registry.stores.views.getById(pathParam.val)?.getObj();
        }
    }
}