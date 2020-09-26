import { MeshViewFactory } from "../models/views/MeshView";
import { NodeConnectionViewFactory } from "../models/views/NodeConnectionView";
import { NodeViewFactory } from "../models/views/NodeView";
import { PathViewFactory } from "../models/views/PathView";
import { SpriteViewFactory } from "../models/views/SpriteView";
import { View, ViewFactory } from "../models/views/View";
import { Registry } from "../Registry";

export class ViewService {
    private factoriesByType: Map<string, ViewFactory> = new Map();
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
        this.registerView(new MeshViewFactory());
        this.registerView(new SpriteViewFactory());
        this.registerView(new PathViewFactory());
        this.registerView(new NodeViewFactory(this.registry));
        this.registerView(new NodeConnectionViewFactory());
    }

    getRegisteredTypes(): string[] {
        return Array.from(this.factoriesByType.keys());
    }

    isRegistered(objType: string): boolean {
        return this.factoriesByType.has(objType);
    }

    registerView(viewFactory: ViewFactory) {
        this.factoriesByType.set(viewFactory.viewType, viewFactory);
    }

    createView(viewType: string): View {
        if (!this.factoriesByType.has(viewType)) {
            throw new Error(`No factory for ViewType ${viewType} exists`);
        }

        return this.factoriesByType.get(viewType).newInstance();
    }
}