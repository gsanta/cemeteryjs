import { AnimationNodeType } from "../../plugins/node_plugins/AnimationNodeObj";
import { RouteNodeObjType } from "../../plugins/node_plugins/route_node/RouteNodeObj";
import { Registry } from "../Registry";
import { ImportService } from "./import/ImportService";

export class GameService {
    serviceName = 'game-service';
    
    private afterRenders: (() => void)[] = [];

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
        this.registry.services.node.graph.getNodesByType(RouteNodeObjType).forEach(node => node.obj.execute(this.registry));

        this.registry.services.node.graph.getNodesByType(AnimationNodeType).forEach(node => node.obj.execute(this.registry));
    }

    // updateConcepts(concepts: View[]) {
    //     this.deleteConcepts(concepts);

    //     concepts.forEach(concept => this.addConcept(concept))
    // }
}