import { NodeObj, NodeParams } from "../../../../../core/models/objs/node_obj/NodeObj";
import { NodeParamField, PortDirection, PortDataFlow, NodeParam } from "../../../../../core/models/objs/node_obj/NodeParam";
import { RayObj } from "../../../../../core/models/objs/RayObj";
import { NodeView } from "../../views/NodeView";
import { Registry } from "../../../../../core/Registry";
import { AbstractNodeExecutor } from "../../../../../core/services/node/INodeExecutor";
import { AbstractNodeFactory } from "../AbstractNode";
import { RayCasterNodeParams } from "../ray_caster_node/RayCasterNode";
import { RayHelperNodeControllers } from "./RayHelperNodeControllers";

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

    createView(obj: NodeObj): NodeView {
        const nodeView = new NodeView(this.registry);
        nodeView.setObj(obj);
        nodeView.addParamControllers(new RayHelperNodeControllers(this.registry, nodeView.getObj()));
        nodeView.id = this.registry.data.view.node.generateId(nodeView);

        return nodeView;
    }

    createObj(): NodeObj {
        const obj = new NodeObj(this.nodeType, {displayName: this.displayName});
        obj.setParams(new RayHelperNodeParams(obj, this.registry));
        obj.id = this.registry.stores.objStore.generateId(obj.type);
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
        field: NodeParamField.NumberField,
        val: -1
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
    port = {
        direction: PortDirection.Output,
        dataFlow: PortDataFlow.Push
    }

    execute() {
        if (this.nodeObj.getPort('rayCaster').hasConnectedPort()) {
            const rayCasterNodeParams = this.nodeObj.getPort('rayCaster').getConnectedPorts()[0].getNodeObj().param as RayCasterNodeParams;
            const rayObj = <RayObj> rayCasterNodeParams.ray.val;

            this.registry.engine.rays.createHelper(rayObj);
            
            if (this.nodeObj.param.remove.val && this.nodeObj.param.remove.val !== -1) {
                setTimeout(() => this.registry.engine.rays.removeHelper(rayObj), this.nodeObj.param.remove.val * 1000);
            }
        }
    }
}