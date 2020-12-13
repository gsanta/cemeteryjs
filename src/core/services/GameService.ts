import { AnimationNodeType } from "../../plugins/canvas_plugins/node_editor/nodes/AnimationNode";
import { RouteNodeObjType } from "../../plugins/canvas_plugins/node_editor/nodes/route_node/RouteNode";
import { PortDataFlow } from "../models/objs/NodeObj";
import { Registry } from "../Registry";
import { ImportService } from "./import/ImportService";

export class GameService {
    viewImporter: ImportService;

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    renderLoop() {
        const animationNodes = this.registry.data.helper.node.graph.getNodesByType(RouteNodeObjType);
        animationNodes.forEach(animationNode => animationNode.getObj().execute());

        const routeNodes = this.registry.data.helper.node.graph.getNodesByType(RouteNodeObjType);
        routeNodes.forEach(routeNode => routeNode.getObj().execute());

        const rootNodes = this.registry.data.helper.node.graph.getRootNodes();
        rootNodes.forEach((node) => {
            node.getPorts()
                .filter(port => !port.isInputPort() && port.isPushPort())
                .forEach(port => {
                    if (port.hasListener() && port.getListener().onBeforeRender) {
                        port.getListener().onBeforeRender(port.getNodeObj(), this.registry);
                    }
                });
        })
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