import { MeshObj } from "../../../../../core/models/objs/MeshObj";
import { NodeObj, NodeParams } from "../../../../../core/models/objs/node_obj/NodeObj";
import { NodeParam, NodeParamField, PortDataFlow, PortDirection } from "../../../../../core/models/objs/node_obj/NodeParam";
import { Registry } from "../../../../../core/Registry";
import { NodeView } from "../views/NodeView";
import { AbstractNodeFactory } from "../../api/AbstractNode";
import { CollisionNodeControllers } from "../../controllers/nodes/CollisionNodeControllers";
import { CollisionConstraint } from "../../domain/CollisionConstraint";

export const CollisionNodeType = 'collision-node-obj';

export class CollisionNode extends AbstractNodeFactory {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
}

    nodeType = CollisionNodeType;
    displayName = 'Collision';
    category = 'Mesh';

    createView(obj: NodeObj): NodeView {
        const nodeView = new NodeView(this.registry);
        nodeView.setObj(obj);
        nodeView.addParamControllers(new CollisionNodeControllers(this.registry, obj));
        nodeView.id = this.registry.data.view.node.generateId(nodeView);

        return nodeView;
    }

    createObj(): NodeObj {
        const obj = new NodeObj<CollisionNodeParams>(this.nodeType, {displayName: this.displayName});
        obj.setParams(new CollisionNodeParams(this.registry, obj));
        obj.id = this.registry.stores.objStore.generateId(obj.type);
        obj.graph = this.registry.data.helper.node.graph;
        
        return obj;
    }
}

export class CollisionNodeParams extends NodeParams {

    constructor(registry: Registry, nodeObj: NodeObj) {
        super();

        const collisionConstraint = new CollisionConstraint(registry);

        this.pull = new PullNodeParam(nodeObj, this, collisionConstraint);
    }

    readonly pull: NodeParam;

    readonly collision: NodeParam<boolean> = {
        name: 'collision',
        field: NodeParamField.Checkbox,
        val: undefined,
    }
}

// class CollisionNodeParam extends NodeParam<CollisionConstraint> {
//     private collisionContraint: CollisionConstraint;

//     constructor(nodeObj: NodeObj, collisionContraint: CollisionConstraint) {
//         super(nodeObj);

//         this.collisionContraint = collisionContraint;
//     }
    
//     name = 'collision';
//     field = NodeParamField.Checkbox;
//     setVal(val: CollisionConstraint) {

//     }
//     getVal() {
//         return this.collisionContraint;
//     }
// }

class PullNodeParam extends NodeParam<CollisionConstraint> {
    private collisionContraint: CollisionConstraint;
    private params: CollisionNodeParams;

    constructor(nodeObj: NodeObj, params: CollisionNodeParams, collisionContraint: CollisionConstraint) {
        super(nodeObj);

        this.params = params;
        this.collisionContraint = collisionContraint;
    }

    name = 'pull'
    getVal() {
        if (this.params.collision.val) {
            return this.collisionContraint;
        }
    }
    port = {
        direction: PortDirection.Output,
        dataFlow: PortDataFlow.Pull
    }
}