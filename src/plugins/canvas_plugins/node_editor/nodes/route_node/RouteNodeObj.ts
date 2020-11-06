import { MeshObj } from "../../../../../core/models/objs/MeshObj";
import { CustomNodeParamSerializer, NodeLink, NodeObj, NodeParam, NodeParamJson } from "../../../../../core/models/objs/NodeObj";
import { PathObj } from "../../../../../core/models/objs/PathObj";
import { NodeView } from "../../../../../core/models/views/NodeView";
import { FormController, PropContext, PropController } from '../../../../../core/plugin/controller/FormController';
import { UI_Region } from "../../../../../core/plugin/UI_Panel";
import { Registry } from "../../../../../core/Registry";
import { INodeExecutor } from "../../../../../core/services/node/INodeExecutor";
import { UI_Element } from "../../../../../core/ui_components/elements/UI_Element";
import { AbstractNode } from "../AbstractNode";
import { RouteWalker } from "./RouteWalker";

export const RouteNodeObjType = 'route-node-obj';

export class RouteNode extends AbstractNode {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    nodeType = RouteNodeObjType;
    displayName = 'Route';
    category = 'Default';

    getParams(): NodeParam[] {
        return [
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
            }
        ];
    }

    getOutputLinks(): NodeLink[] {
        return [
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
        ]
    }

    getInputLinks(): NodeLink[] {
        return [
            {
                name: 'mesh'
            },
            {
                name: 'path'
            }
        ];
    }

    getController(): FormController {
        return new FormController(undefined, this.registry, [new SpeedControl()]);
    }

    getExecutor(): INodeExecutor {
        return new RouteNodeExecutor(this.registry);
    }
}

class RouteNodeSerializer implements CustomNodeParamSerializer {
    serialize(param: NodeParam): NodeParamJson {
        if (param.name === 'routeWalker') {
            return {
                name: 'routeWalker',
                val: undefined,
                isLink: 'none'
            }
        }
    }
    
    deserialize(json: NodeParamJson): NodeParam {
        return undefined;
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

    blur(context: PropContext, element) {
        const speed = context.getTempVal();
        context.clearTempVal();

        const nodeView = context.registry.stores.views.getById(element.targetId) as NodeView;

        try {
            if (speed) {
                const speedNum = parseFloat(speed);
                nodeView.getObj().setParam('speed', speedNum);
            }
        } catch (e) {
            console.log(e);
        }

        const routeWalker = nodeView.getObj().getParam('routeWalker').val as RouteWalker;
        if (routeWalker) {
            routeWalker.setSpeed(nodeView.getObj().getParam('speed').val);
        }

        context.registry.services.history.createSnapshot();
        context.registry.services.render.reRender(UI_Region.Canvas1);
    }
}


export class RouteNodeExecutor implements INodeExecutor {
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    execute(nodeObj: NodeObj) {
        const meshObj = this.getMeshObj(nodeObj, this.registry);
        const pathObj = this.getPathObj(nodeObj, this.registry);

        if (!meshObj || !pathObj) { return; }

        if (!nodeObj.getParam('routeWalker').val) {
            nodeObj.setParam('routeWalker', new RouteWalker(meshObj, pathObj));
        }

        const routeWalker = <RouteWalker> nodeObj.getParam('routeWalker').val;
        routeWalker.step();
    }

    executeStart(nodeObj: NodeObj) {
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