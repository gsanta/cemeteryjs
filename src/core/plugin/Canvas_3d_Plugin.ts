import { IEngineFacade } from "../engine/IEngineFacade";
import { ICamera } from "../models/misc/camera/ICamera";
import { Registry } from "../Registry";
import { AbstractCanvasPlugin, calcOffsetFromDom } from "./AbstractCanvasPlugin";
import { ToolType } from "./tools/Tool";
import { UI_Region } from "./UI_Plugin";
import { CameraTool } from "./tools/CameraTool";

export function getCanvasElement(viewId: string): HTMLCanvasElement {
    if (typeof document !== 'undefined') {
        const canvas: HTMLCanvasElement = document.querySelector(`#${viewId} canvas`);
        return canvas;
    }
}

export abstract class Canvas_3d_Plugin extends AbstractCanvasPlugin {
    region = UI_Region.Canvas2;
    engine: IEngineFacade;

    constructor(id: string, registry: Registry) {
        super(registry);

        this.id = id;
    }

    getStore() {
        return this.registry.stores.views;
    }

    resize() {
        (this.engine || this.registry.engine).resize();
    }
    
    getOffset() {
        return calcOffsetFromDom(this.htmlElement);
    }

    getCamera(): ICamera {
        return (this.engine || this.registry.engine).getCamera();
    }
}