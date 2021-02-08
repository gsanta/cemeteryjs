import { MeshObj } from "../../../../../core/models/objs/MeshObj";
import { NodeObj, NodeParams } from "../../../../../core/models/objs/node_obj/NodeObj";
import { NodeParam, PortDataFlow, PortDirection } from "../../../../../core/models/objs/node_obj/NodeParam";
import { Registry } from "../../../../../core/Registry";
import { NodeShape } from "../shapes/NodeShape";
import { AbstractNodeFactory } from "../../api/AbstractNode";
import { CollisionNodeControllers } from "../../controllers/nodes/CollisionNodeControllers";
import { CollisionConstraint } from "../../controllers/domain/CollisionConstraint";
import { Canvas2dPanel } from "../../../../../core/models/modules/Canvas2dPanel";
import { NodeEditorPanelId } from "../../../NodeEditorModule";
import { Canvas3dPanel } from "../../../../../core/models/modules/Canvas3dPanel";
import { SceneEditorPanelId } from "../../../../scene_editor/main/SceneEditorModule";

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

    createView(obj: NodeObj): NodeShape {
        const nodeView = new NodeShape(this.registry, <Canvas2dPanel> this.registry.services.module.ui.getCanvas(NodeEditorPanelId));
        nodeView.setObj(obj);
        nodeView.addParamControllers(new CollisionNodeControllers(this.registry, obj));
        nodeView.id = this.registry.data.node.items.generateId(nodeView);

        return nodeView;
    }

    createObj(): NodeObj {
        const canvas =  <Canvas3dPanel> this.registry.services.module.ui.getCanvas(SceneEditorPanelId);
        const obj = new NodeObj<CollisionNodeParams>(this.nodeType, canvas, {displayName: this.displayName});
        obj.setParams(new CollisionNodeParams(this.registry, obj));
        obj.id = this.registry.data.scene.items.generateId(obj);
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
        ownVal: undefined,
    }
}

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
        if (this.params.collision.ownVal) {
            return this.collisionContraint;
        }
    }
    portDirection = PortDirection.Output;
    portDataFlow = PortDataFlow.Pull;
}