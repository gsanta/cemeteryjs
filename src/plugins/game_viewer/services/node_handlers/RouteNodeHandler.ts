import { BuiltinNodeType, NodeModel } from '../../../../core/stores/game_objects/NodeModel';
import { AbstractNodeHandler } from "./AbstractNodeHandler";
import { RouteModel } from "../../../../core/stores/game_objects/RouteModel";
import { ViewType } from "../../../../core/stores/views/View";

export class RouteNodeHandler extends AbstractNodeHandler {
    nodeType: BuiltinNodeType.Route;

    handle() {

    }

    wake(node: NodeModel) {
        super.wake(node);
        const meshNode = this.findNodeAtInputSlot('mesh', BuiltinNodeType.Mesh);
        const pathNode = this.findNodeAtInputSlot('path', BuiltinNodeType.Path);

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
        const meshNode = this.findNodeAtInputSlot<MeshNode>('mesh', BuiltinNodeType.Mesh);
        const pathNode = this.findNodeAtInputSlot<PathNode>('path', BuiltinNodeType.Path);

        if (!meshNode || !meshNode.meshModel || !pathNode.pathModel || !pathNode) { return; }

        if (node.route) {
            node.route.meshModel = meshNode.meshModel;
            node.route.pathModel = pathNode.pathModel;
            node.route.update();
        }
    }
}