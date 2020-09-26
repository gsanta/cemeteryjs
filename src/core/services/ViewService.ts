import { MeshViewFactory } from "../models/views/MeshView";
import { NodeConnectionFactory } from "../models/views/NodeConnectionView";
import { NodeViewFactory } from "../models/views/NodeView";
import { PathViewFactory } from "../models/views/PathView";
import { SpriteViewFactory } from "../models/views/SpriteView";
import { View, ViewFactory } from "../models/views/View";

export class ViewService {
    private factoriesByType: Map<string, ViewFactory> = new Map();

    constructor() {
        this.registerView(new MeshViewFactory());
        this.registerView(new SpriteViewFactory());
        this.registerView(new PathViewFactory());
        this.registerView(new NodeViewFactory());
        this.registerView(new NodeConnectionFactory());
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