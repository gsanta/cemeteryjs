import { NodeType, NodeModel, SlotName } from "../../../models/views/nodes/NodeModel";
import { MoveNode } from '../../../models/views/nodes/MoveNode';
import { AbstractNodeHandler } from "./AbstractNodeHandler";
import { MeshNode } from "../../../models/views/nodes/MeshNode";
import { RouteWalker } from "../../../../game/services/walkers/RouteWalker";
import { PathNode } from "../../../models/views/nodes/PathNode";

export class RouteNodeHandler extends AbstractNodeHandler<MoveNode> {
    nodeType: NodeType.Route;

    private routeWalker: RouteWalker = new RouteWalker();;

    handle() {
        const meshNode = this.findNodeAtInputSlot<MeshNode>('mesh', NodeType.Mesh);
        const pathNode = this.findNodeAtInputSlot<PathNode>('path', NodeType.Path);

        if (!meshNode || !meshNode.meshModel || !pathNode.pathModel || !pathNode) { return; }
        
        const route = this.registry.stores.gameStore.getRouteById( `${meshNode.nodeView.id}-route`)
        this.routeWalker.initRoute(route);
        this.routeWalker.walk(route);
    }
}