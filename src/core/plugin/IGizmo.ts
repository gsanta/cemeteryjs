import { Registry } from "../Registry";
import { UI_Row } from "../ui_components/elements/UI_Row";
import { AbstractCanvasPanel } from "./AbstractCanvasPanel";
import { FormController } from "../controller/FormController";
import { IRenderer } from "./IRenderer";

export interface IGizmoFactory {
    newInstance(plugin: AbstractCanvasPanel, registry: Registry): GizmoPlugin;
}

export class GizmoPlugin {
    private onMountFunc: () => void = () => undefined;
    private registry: Registry;
    readonly width: number;
    readonly height: number;

    private customData: Map<string, any> = new Map();

    renderer: IRenderer;
    controller: FormController;

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
    
    onMount(onMountFunc: () => void) {
        this.onMountFunc = onMountFunc;
    }

    mount() {
        this.onMountFunc();
    }
}