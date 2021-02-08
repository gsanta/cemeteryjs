import { Canvas2dPanel } from "../../../../../core/models/modules/Canvas2dPanel";
import { NodeObj, NodeParams } from "../../../../../core/models/objs/node_obj/NodeObj";
import { NodeParam, PortDataFlow, PortDirection } from "../../../../../core/models/objs/node_obj/NodeParam";
import { RayObj } from "../../../../../core/models/objs/RayObj";
import { Registry } from "../../../../../core/Registry";
import { NodeEditorPanelId } from "../../../NodeEditorModule";
import { AbstractNodeFactory } from "../../api/AbstractNode";
import { RayHelperNodeControllers } from "../../controllers/nodes/RayHelperNodeControllers";
import { NodeShape } from "../shapes/NodeShape";
import { RayCasterNodeParams } from "./RayCasterNode";

export const RayHelperNodeType = 'ray-helper-node-obj';

export class RayHelperNode extends AbstractNodeFactory {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    nodeType = RayHelperNodeType;
    displayName = 'RayHelper';
    category = 'Default';

    createView(obj: NodeObj): NodeShape {
        const nodeView = new NodeShape(this.registry, this.registry.services.module.ui.nodeEditor);
        nodeView.setObj(obj);
        nodeView.addParamControllers(new RayHelperNodeControllers(this.registry, nodeView.getObj()));
        nodeView.id = this.registry.data.node.items.generateId(nodeView);

        return nodeView;
    }

    createObj(): NodeObj {
        const obj = new NodeObj(this.nodeType, this.registry.services.module.ui.sceneEditor, {displayName: this.displayName});
        obj.setParams(new RayHelperNodeParams(obj, this.registry));
        obj.id = this.registry.data.scene.items.generateId(obj);
        obj.graph = this.registry.data.helper.node.graph;

        return obj;
    }
}

export class RayHelperNodeParams extends NodeParams {

    constructor(nodeObj: NodeObj, registry: Registry) {
        super();

        this.rayCaster = new RayCasterNodeParam(registry, nodeObj);
    }

    readonly remove: NodeParam = {
        name: 'remove',
        ownVal: -1
    }
    
    readonly rayCaster: RayCasterNodeParam;
}

class RayCasterNodeParam extends NodeParam {
    private registry: Registry;

    constructor(registry: Registry, nodeObj: NodeObj) {
        super(nodeObj);

        this.registry = registry;
    }

    name = 'rayCaster';
    portDirection = PortDirection.Output;
    portDataFlow = PortDataFlow.Push;

    execute() {
        if (this.nodeObj.getPort('rayCaster').hasConnectedPort()) {
            const rayCasterNodeParams = this.nodeObj.getPort('rayCaster').getConnectedPorts()[0].getNodeObj().param as RayCasterNodeParams;
            const rayObj = <RayObj> rayCasterNodeParams.ray.ownVal;

            this.registry.engine.rays.createHelper(rayObj);
            
            if (this.nodeObj.param.remove.val && this.nodeObj.param.remove.val !== -1) {
                setTimeout(() => this.registry.engine.rays.removeHelper(rayObj), this.nodeObj.param.remove.val * 1000);
            }
        }
    }
}