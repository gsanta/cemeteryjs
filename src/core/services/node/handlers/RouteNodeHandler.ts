import { MeshNode } from "../../../models/nodes/MeshNode";
import { NodeType } from "../../../models/nodes/NodeModel";
import { PathNode } from "../../../models/nodes/PathNode";
import { RouteNode } from "../../../models/nodes/RouteNode";
import { AbstractNodeHandler } from "./AbstractNodeHandler";
import { RouteModel } from "../../../models/game_objects/RouteModel";
import { ConceptType } from "../../../models/views/View";

export class RouteNodeHandler extends AbstractNodeHandler<RouteNode> {
    nodeType: NodeType.Route;

    handle() {

    }

    wake(node: RouteNode) {
        super.wake(node);
        const meshNode = this.findNodeAtInputSlot<MeshNode>('mesh', NodeType.Mesh);
        const pathNode = this.findNodeAtInputSlot<PathNode>('path', NodeType.Path);

        const route = new RouteModel();
        route.id = this.registry.stores.gameStore.generateUniqueName(ConceptType.RouteConcept);
        this.registry.stores.gameStore.addItem(route);
        node.route = route;
        node.route.meshModel = meshNode.meshModel;
        node.route.pathModel = pathNode.pathModel;
        node.route.reset();
        node.route.play();
    }
    
    update(node: RouteNode) {
        super.update(node);
        const meshNode = this.findNodeAtInputSlot<MeshNode>('mesh', NodeType.Mesh);
        const pathNode = this.findNodeAtInputSlot<PathNode>('path', NodeType.Path);

        if (!meshNode || !meshNode.meshModel || !pathNode.pathModel || !pathNode) { return; }

        if (node.route) {
            node.route.meshModel = meshNode.meshModel;
            node.route.pathModel = pathNode.pathModel;
            node.route.update();
        }
    }
}