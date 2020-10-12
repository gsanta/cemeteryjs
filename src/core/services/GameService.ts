import { AnimationNodeType } from "../../plugins/canvas_plugins/node_editor/nodes/AnimationNodeObj";
import { RouteNodeObjType } from "../../plugins/canvas_plugins/node_editor/nodes/route_node/RouteNodeObj";
import { Registry } from "../Registry";
import { ImportService } from "./import/ImportService";

export class GameService {
    private afterRenders: (() => void)[] = [];

    private _isPlaying = false;

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
        const animationNodes = this.registry.services.node.graph.getNodesByType(RouteNodeObjType);
        animationNodes.forEach(animationNode => {
            this.registry.services.node.executeNode(animationNode.getObj())
        });

        const routeNodes = this.registry.services.node.graph.getNodesByType(RouteNodeObjType);
        routeNodes.forEach(routeNode => {
            this.registry.services.node.executeNode(routeNode.getObj())
        });
    }

    setPlaying(isPlaying: boolean) {
        this._isPlaying = isPlaying;

        const playableNodes = [
            ...this.registry.services.node.graph.getNodesByType(RouteNodeObjType),
            ...this.registry.services.node.graph.getNodesByType(AnimationNodeType),
        ];

        playableNodes.forEach(node => {
            if (isPlaying) {
                this.registry.services.node.executeStartNode(node.getObj());
            } else {
                this.registry.services.node.executeStopNode(node.getObj());
            }
        });
    }

    isPlaying() {
        return this._isPlaying;
    }

    // updateConcepts(concepts: View[]) {
    //     this.deleteConcepts(concepts);

    //     concepts.forEach(concept => this.addConcept(concept))
    // }
}