import { AnimationNodeType } from "../../plugins/canvas_plugins/node_editor/nodes/AnimationNode";
import { RouteNodeObjType } from "../../plugins/canvas_plugins/node_editor/nodes/route_node/RouteNode";
import { Registry } from "../Registry";
import { ImportService } from "./import/ImportService";

export class GameService {
    viewImporter: ImportService;

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;

        // TODO register elsewhere without settimeout
        setTimeout(() => {
            this.registry.engine.registerRenderLoop(() => this.renderLoop())
        }, 0);
    }

    private renderLoop() {
        const animationNodes = this.registry.data.helper.node.graph.getNodesByType(RouteNodeObjType);
        animationNodes.forEach(animationNode => animationNode.getObj().execute());

        const routeNodes = this.registry.data.helper.node.graph.getNodesByType(RouteNodeObjType);
        routeNodes.forEach(routeNode => routeNode.getObj().execute());
    }

    // setPlaying(isPlaying: boolean) {
    //     this.registry.stores.game.gameState = 'running';

    //     const playableNodes = [
    //         ...this.registry.services.node.graph.getNodesByType(RouteNodeObjType),
    //         ...this.registry.services.node.graph.getNodesByType(AnimationNodeType),
    //     ];

    //     playableNodes.forEach(node => {
    //         if (isPlaying) {
    //             this.registry.services.node.executeStartNode(node.getObj());
    //         } else {
    //             this.registry.services.node.executeStopNode(node.getObj());
    //         }
    //     });
    // }

    // updateConcepts(concepts: View[]) {
    //     this.deleteConcepts(concepts);

    //     concepts.forEach(concept => this.addConcept(concept))
    // }
}