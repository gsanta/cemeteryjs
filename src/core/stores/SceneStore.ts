import { MeshView } from "../models/views/MeshView";
import { PathView } from "../models/views/PathView";
import { SpriteView } from "../models/views/SpriteView";
import { View } from "../models/views/View";
import { Registry } from "../Registry";
import { AbstractViewStore } from "./AbstractViewStore";

export function isView(type: string) {
    return type.endsWith('View');
}

export class SceneStore extends AbstractViewStore<MeshView | SpriteView | PathView> {
    static id = 'scene-store'; 
    id = SceneStore.id;
    views: View[] = [];

    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }
}