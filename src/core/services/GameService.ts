import { RouteNodeObjType } from "../../plugins/canvas_plugins/node_editor/models/nodes/RouteNode";
import { NodeObj, NodeParams } from "../models/objs/node_obj/NodeObj";
import { NodeParam } from "../models/objs/node_obj/NodeParam";
import { Registry } from "../Registry";
import { ImportService } from "./import/ImportService";
import { IKeyboardEvent } from "./input/KeyboardService";

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

        const nodeObjs = this.registry.data.helper.node.graph.getAllNodes();
        nodeObjs.forEach(nodeObj => nodeObj.listener && nodeObj.listener.onBeforeRender && nodeObj.listener.onBeforeRender(nodeObj, this.registry))

    }

    executeKeyDown(e: IKeyboardEvent) {
        const nodeObjs = this.registry.data.helper.node.graph.getAllNodes();
        nodeObjs.forEach(nodeObj => nodeObj.listener && nodeObj.listener.onKeyDown && nodeObj.listener.onKeyDown(e, nodeObj, this.registry))
    }

    executeKeyUp(e: IKeyboardEvent) {
        const nodeObjs = this.registry.data.helper.node.graph.getAllNodes();
        nodeObjs.forEach(nodeObj => nodeObj.listener && nodeObj.listener.onKeyUp && nodeObj.listener.onKeyUp(e, nodeObj, this.registry))
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