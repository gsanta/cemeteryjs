import { RouteNodeObjType } from "../../plugins/canvas_plugins/node_editor/nodes/route_node/RouteNode";
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

        // const nodes = this.registry.data.helper.node.graph.getAllNodes();
        // nodes.forEach((node) => {
        //     node.getParams()
        //         .forEach(port => {
        //             if (port.hasListener() && port.getListener().onBeforeRender) {
        //                 port.getListener().onBeforeRender(port.getNodeObj(), this.registry);
        //             }
        //         });
        // });

        this.iterateNodeParams((nodeObj: NodeObj, param: NodeParam) => {
            if (param.listener && param.listener.onBeforeRender) {
                param.listener.onBeforeRender(nodeObj, this.registry);
            }
        })
    }

    executeKeyDown(e: IKeyboardEvent) {
        this.iterateNodeParams((nodeObj: NodeObj, param: NodeParam) => {
            if (param.listener && param.listener.onKeyDown) {
                param.listener.onKeyDown(e, nodeObj, this.registry);
            }
        })
    }

    executeKeyUp(e: IKeyboardEvent) {
        this.iterateNodeParams((nodeObj: NodeObj, param: NodeParam) => {
            if (param.listener && param.listener.onKeyDown) {
                param.listener.onKeyUp(e, nodeObj, this.registry);
            }
        })
    }

    private iterateNodeParams(callback: (nodeObj: NodeObj, param: NodeParam) => void) {
        const nodes = this.registry.data.helper.node.graph.getAllNodes();
        nodes.forEach((node) => node.getParams().forEach(param => callback(node, param)));
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