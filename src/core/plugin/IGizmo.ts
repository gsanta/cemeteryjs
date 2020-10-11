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
    private onMountFunc: () => void = () => undefined;
    private registry: Registry;
    private width: number;
    private height: number;

    private customData: Map<string, any> = new Map();

    constructor(registry: Registry, width: number, height: number) {
        this.registry = registry;
        this.width = width;
        this.height = height;
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

    onMount(onMountFunc: () => void) {
        this.onMountFunc = onMountFunc;
    }

    mount() {
        this.onMountFunc();
    }

    getFormController(controllerId: string): FormController {
        return null;
    }

    addFormController(controllerId: string, controller: FormController): void {
    }

    renderInto(element: UI_Row): void {
        const box = element.box({});
        box.width = this.width + 'px' || '100px';
        box.height = this.height + 'px' || '100px';
        
        if (this.renderer) {
            this.renderer(box, this, this.registry);
        }
    }
}