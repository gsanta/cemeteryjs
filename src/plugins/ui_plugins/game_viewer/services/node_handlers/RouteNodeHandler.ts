import { BuiltinNodeType, NodeModel } from '../../../../../core/models/game_objects/NodeModel';
import { AbstractNodeHandler } from "./AbstractNodeHandler";
import { RouteModel } from "../../../../../core/models/game_objects/RouteModel";
import { ViewType } from "../../../../../core/models/views/View";

export class RouteNodeHandler extends AbstractNodeHandler {
    nodeType: BuiltinNodeType.Route;

    handle() {

    }

    wake(node: NodeModel) {
        super.wake(node);
        const meshNode = this.findNodeAtInputSlot('mesh', BuiltinNodeType.Mesh);
        const pathNode = this.findNodeAtInputSlot('path', BuiltinNodeType.Path);

        const route = new RouteModel();
        route.id = this.registry.stores.gameStore.generateId(ViewType.RouteView);
        
        this.registry.stores.gameStore.addRoute(route);

        node.getParam('route').val = route.id;

        route.meshModel = this.registry.stores.canvasStore.getMeshViewById(meshNode.getParam('mesh').val).obj;
        route.pathModel = this.registry.stores.canvasStore.getPathViewById(pathNode.getParam('path').val).model;
        route.reset();
        route.play();
    }
    
    update(node: NodeModel) {
        super.update(node);
        const meshNode = this.findNodeAtInputSlot('mesh', BuiltinNodeType.Mesh);
        const pathNode = this.findNodeAtInputSlot('path', BuiltinNodeType.Path);

        if (!meshNode || !meshNode.getParam('mesh').val || !pathNode.getParam('path').val || !pathNode) { return; }

        if (node.getParam('route')) {

            const route = <RouteModel> this.registry.stores.gameStore.byId(node.getParam('route').val);

            route.meshModel = this.registry.stores.canvasStore.getMeshViewById(meshNode.getParam('mesh').val).obj;
            route.pathModel = this.registry.stores.canvasStore.getPathViewById(pathNode.getParam('path').val).model;

            route.update();
        }
    }
}