import { AbstractPlugin, calcOffsetFromDom } from '../../core/AbstractPlugin';
import { Registry } from '../../core/Registry';
import { EngineService } from '../../core/services/EngineService';
import { MeshLoaderService } from '../../core/services/MeshLoaderService';
import { LayoutType } from '../../core/services/PluginService';
import { Camera3D } from '../common/camera/Camera3D';
import { ICamera } from '../common/camera/ICamera';
import { PluginServices } from '../common/PluginServices';
import { toolFactory } from '../common/toolbar/toolFactory';
import { Tool, ToolType } from '../common/tools/Tool';
import { ImportSettings } from '../scene_editor/settings/ImportSettings';
import { Tools } from '../Tools';
import { ThumbnailMakerService } from './services/ThumbnailMakerService';
import { Point } from '../../core/geometry/shapes/Point';
(<any> window).earcut = require('earcut');

export function getCanvasElement(viewId: string): HTMLCanvasElement {
    if (typeof document !== 'undefined') {
        const canvas: HTMLCanvasElement = document.querySelector(`#${viewId} canvas`);
        return canvas;
    }
}

export class MeshImporterPlugin extends AbstractPlugin {
    static id = 'mesh-importer-plugin';
    visible = true;
    allowedLayouts = new Set([LayoutType.Dialog]);

    constructor(registry: Registry) {
        super(registry);

        const tools = [ToolType.Camera].map(toolType => toolFactory(toolType, this, registry));
        this.tools = new Tools(tools);

        this.selectedTool = this.tools.byType(ToolType.Camera);

        this.pluginServices = new PluginServices(
            [
                new EngineService(this, this.registry),
                new MeshLoaderService(this, this.registry),
                new ThumbnailMakerService(this, this.registry)
            ]
        );

        this.settings = [
            new ImportSettings(this.registry)
        ];
    }

    getStore() {
        return null;
    }

    getCamera(): ICamera {
        return this.pluginServices.engineService().getCamera();
    }

    resize() {
        this.pluginServices.engineService().getEngine() && this.pluginServices.engineService().getEngine().resize();
    }

    componentMounted(htmlElement: HTMLElement) {
        super.componentMounted(htmlElement);
    }

    getId(): string {
        return MeshImporterPlugin.id;
    }

    getSelectedTool(): Tool {
        return this.selectedTool;
    }

    isVisible(): boolean {
        return this.visible;
    }

    setVisible(visible: boolean) {
        this.visible = visible;
    }    

    getOffset() {
        if (this.htmlElement) {
            return calcOffsetFromDom(this.htmlElement);
        }

        return new Point(0, 0);
    }
}