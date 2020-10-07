import { RouteNodeObjType } from "../../plugins/canvas_plugins/node_editor/nodes/route_node/RouteNodeObj";
import { Registry } from "../Registry";
import { ImportService } from "./import/ImportService";

export class GameService {
    private afterRenders: (() => void)[] = [];

    isPlaying = false;

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
        const routeNodes = this.registry.services.node.graph.getNodesByType(RouteNodeObjType);
        routeNodes.forEach(routeNode => {
            this.registry.services.node.executeNode(routeNode.getObj())
        });

        if (this.isPlaying) {
            const animationNodes = this.registry.services.node.graph.getNodesByType(RouteNodeObjType);
            animationNodes.forEach(animationNode => {
                this.registry.services.node.executeNode(animationNode.getObj())
            });
        }
    }

    // updateConcepts(concepts: View[]) {
    //     this.deleteConcepts(concepts);

    //     concepts.forEach(concept => this.addConcept(concept))
    // }
}