import { Registry } from "../Registry";
import { AbstractCanvasPlugin } from "./AbstractCanvasPlugin";

export interface IGizmoFactory {
    newInstance(plugin: AbstractCanvasPlugin, registry: Registry): IGizmo;
}

export interface IGizmo {
    mount();
    destroy();
    render();
}