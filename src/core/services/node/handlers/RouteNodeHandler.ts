import { NodeType, NodeModel, SlotName } from "../../../models/views/nodes/NodeModel";
import { MoveNode } from '../../../models/views/nodes/MoveNode';
import { AbstractNodeHandler } from "./AbstractNodeHandler";
import { MeshNode } from "../../../models/views/nodes/MeshNode";
import { RouteWalker } from "../../../../game/services/walkers/RouteWalker";
import { PathNode } from "../../../models/views/nodes/PathNode";
import { RouteNode } from "../../../models/views/nodes/RouteNode";

export class RouteNodeHandler extends AbstractNodeHandler<RouteNode> {
    nodeType: NodeType.Route;

    private routeWalker: RouteWalker = new RouteWalker();;

    handle() {

    }

    execute(node: RouteNode) {
        super.execute(node);

        const meshNode = this.findNodeAtInputSlot<MeshNode>('mesh', NodeType.Mesh);
        const pathNode = this.findNodeAtInputSlot<PathNode>('path', NodeType.Path);

        if (!meshNode || !meshNode.meshModel || !pathNode.pathModel || !pathNode) { return; }
        
        const route = this.registry.stores.gameStore.getRouteById( `${pathNode.pathModel.getId()}-route`);
        route.meshModel = meshNode.meshModel;
        this.routeWalker.initRoute(route);
    }
    
    update(node: RouteNode) {
        super.update(node);
        const meshNode = this.findNodeAtInputSlot<MeshNode>('mesh', NodeType.Mesh);
        const pathNode = this.findNodeAtInputSlot<PathNode>('path', NodeType.Path);

        if (!meshNode || !meshNode.meshModel || !pathNode.pathModel || !pathNode) { return; }

        console.log('update')
        
        const route = this.registry.stores.gameStore.getRouteById( `${pathNode.pathModel.getId()}-route`);

        this.routeWalker.walk(route);
    }
}