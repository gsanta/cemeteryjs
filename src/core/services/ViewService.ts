import { MoveAxisViewPlugin } from "../../plugins/canvas_plugins/canvas_utility_plugins/canvas_mesh_transformations/views/MoveAxisViewPlugin";
import { ScaleAxisViewPlugin } from "../../plugins/canvas_plugins/canvas_utility_plugins/canvas_mesh_transformations/views/ScaleAxisViewPlugin";
import { MeshViewPlugin } from "../models/views/MeshView";
import { NodeConnectionViewPlugin } from "../models/views/NodeConnectionView";
import { NodeViewPlugin } from "../models/views/NodeView";
import { PathViewPlugin } from "../models/views/PathView";
import { SpriteViewPlugin } from "../models/views/SpriteView";
import { View, ViewRenderer } from "../models/views/View";
import { UI_Plugin } from '../plugin/UI_Plugin';
import { ViewPlugin } from "../plugin/ViewPlugin";
import { Registry } from "../Registry";
import { UI_SvgCanvas } from "../ui_components/elements/UI_SvgCanvas";

export class ViewService {
    private factoriesByType: Map<string, ViewPlugin> = new Map();
    private renderers: Map<string, ViewRenderer> = new Map();
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
        this.registerView(new MeshViewPlugin());
        this.registerView(new SpriteViewPlugin(this.registry));
        this.registerView(new PathViewPlugin(this.registry));
        this.registerView(new NodeViewPlugin(this.registry));
        this.registerView(new NodeConnectionViewPlugin());
        this.registerView(new MoveAxisViewPlugin(this.registry));
        this.registerView(new ScaleAxisViewPlugin(this.registry));
    }

    getRegisteredTypes(): string[] {
        return Array.from(this.factoriesByType.keys());
    }

    isRegistered(objType: string): boolean {
        return this.factoriesByType.has(objType);
    }

    registerView(viewPlugin: ViewPlugin) {
        this.factoriesByType.set(viewPlugin.id, viewPlugin);

        // if (viewFactory.createRenderer) {
        //     this.renderers.set(viewFactory.viewType, viewFactory.createRenderer(this.registry)); 
        // }
    }

    createView(viewType: string): View {
        if (!this.factoriesByType.has(viewType)) {
            throw new Error(`No factory for ViewType ${viewType} exists`);
        }

        const view = this.factoriesByType.get(viewType).createView();
        view.id = this.registry.stores.views.generateId(view);
        return view;
    }

    renderInto(canvas: UI_SvgCanvas, view: View, plugin: UI_Plugin) {
        this.factoriesByType.get(view.viewType).renderInto(canvas, view, plugin);
    }
}