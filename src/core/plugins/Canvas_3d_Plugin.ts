import { Camera2D } from "../../plugins/common/camera/Camera2D";
import { toolFactory } from "../../plugins/common/toolbar/toolFactory";
import { ToolType } from "./tools/Tool";
import { Registry } from "../Registry";
import { EngineService } from "../services/EngineService";
import { UI_Region } from "./UI_Plugin";
import { AbstractCanvasPlugin, calcOffsetFromDom } from "./AbstractCanvasPlugin";
import { ICamera } from "../../plugins/common/camera/ICamera";

export function getCanvasElement(viewId: string): HTMLCanvasElement {
    if (typeof document !== 'undefined') {
        const canvas: HTMLCanvasElement = document.querySelector(`#${viewId} canvas`);
        return canvas;
    }
}

export class Canvas_3d_Plugin extends AbstractCanvasPlugin {
    region = UI_Region.Canvas2;

    constructor(id: string, registry: Registry) {
        super(registry);

        this.id = id;

        this.toolHandler.registerTool(toolFactory(ToolType.Camera, this, registry))
    }

    getStore() {
        return this.registry.stores.canvasStore;
    }

    resize() {
        const engineService = this.pluginServices.byName<EngineService<this>>(EngineService.serviceName);
        engineService.getEngine() && engineService.getEngine().resize();
    }
    
    getOffset() {
        return calcOffsetFromDom(this.htmlElement);
    }


    activated() {
        if (!this.toolHandler.getSelectedTool()) {
            this.toolHandler.setSelectedTool(ToolType.Camera);
        }
    }

    getCamera(): ICamera {
        return this.pluginServices.engineService().getCamera();
    }
}