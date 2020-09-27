import { NodeView } from "../../models/views/NodeView";
import { Registry } from "../../Registry";
import { UI_Plugin } from "../UI_Plugin";
import { AbstractController } from "./AbstractController";


export abstract class NodeController extends AbstractController {
    nodeView: NodeView;

    constructor(plugin: UI_Plugin, registry: Registry) {
        super(plugin, registry);
    }

    abstract newInstance(): NodeController;
}
