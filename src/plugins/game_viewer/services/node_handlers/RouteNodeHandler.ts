import { MeshNode } from "../../../../core/models/nodes/MeshNode";
import { NodeType } from "../../../../core/models/nodes/NodeModel";
import { PathNode } from "../../../../core/models/nodes/PathNode";
import { RouteNode } from "../../../../core/models/nodes/RouteNode";
import { AbstractNodeHandler } from "./AbstractNodeHandler";
import { RouteModel } from "../../../../core/models/game_objects/RouteModel";
import { ViewType } from "../../../../core/models/views/View";

export class RouteNodeHandler extends AbstractNodeHandler<RouteNode> {
    nodeType: NodeType.Route;

    handle() {

    }

    wake(node: RouteNode) {
        super.wake(node);
        const meshNode = this.findNodeAtInputSlot<MeshNode>('mesh', NodeType.Mesh);
        const pathNode = this.findNodeAtInputSlot<PathNode>('path', NodeType.Path);

        const route = new RouteModel();
        route.id = this.registry.stores.gameStore.generateUniqueName(ViewType.RouteView);
        this.registry.stores.gameStore.addRoute(route);
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