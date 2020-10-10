import { Registry } from "../Registry";
import { UI_Row } from "../ui_components/elements/UI_Row";
import { AbstractCanvasPlugin } from "./AbstractCanvasPlugin";
import { FormController } from "./controller/FormController";
import { IRenderer } from "./IRenderer";

export interface IGizmoFactory {
    newInstance(plugin: AbstractCanvasPlugin, registry: Registry): GizmoPlugin;
}

export class GizmoPlugin {
    private renderer: IRenderer;
    private registry: Registry;

    private customData: Map<string, any> = new Map();

    constructor(registry: Registry) {
        this.registry = registry;
    }

    setData(key: string, value: any) {
        this.customData.set(key, value);
    }

    getData(key: string): any {
        return this.customData.get(key);
    }

    deleteData(key: string): void {
        this.customData.delete(key);
    }
    
    setRenderer(renderer: IRenderer) {
        this.renderer = renderer;
    }

    getFormController(controllerId: string): FormController {
        return null;
    }

    addFormController(controllerId: string, controller: FormController): void {
    }

    renderInto(element: UI_Row): void {
        if (this.renderer) {
            this.renderer(element, this, this.registry);
        }
    }
}