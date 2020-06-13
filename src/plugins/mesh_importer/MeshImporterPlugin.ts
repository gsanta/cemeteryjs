import { AbstractPlugin, calcOffsetFromDom } from '../../core/AbstractPlugin';
import { NodeType } from '../../core/models/nodes/NodeModel';
import { Registry } from '../../core/Registry';
import { LayoutType } from '../../core/services/PluginService';
import { Camera3D } from '../common/camera/Camera3D';
import { ICamera } from '../common/camera/ICamera';
import { Tool, ToolType } from '../common/tools/Tool';
import { toolFactory } from '../common/toolbar/toolFactory';
import { Tools } from '../Tools';
import { ImportSettings } from '../scene_editor/settings/ImportSettings';
import { PluginServices } from '../common/PluginServices';
import { EngineService } from '../../core/services/EngineService';
import { MeshLoaderService } from '../../core/services/MeshLoaderService';
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

    importSettings: ImportSettings;

    private camera: Camera3D;

    constructor(registry: Registry) {
        super(registry);

        const tools = [ToolType.Camera].map(toolType => toolFactory(toolType, this, registry));
        this.tools = new Tools(tools);

        this.selectedTool = this.tools.byType(ToolType.Camera);

        this.importSettings = new ImportSettings(registry);
        this.pluginServices = new PluginServices(
            [
                new EngineService(this, this.registry),
                new MeshLoaderService(this, this.registry)
            ]
        );
    }

    getStore() {
        return null;
    }

    getCamera(): ICamera {
        return this.camera;
    }

    resize() {
        this.pluginServices.engineService().getEngine() && this.pluginServices.engineService().getEngine().resize();
    }

    setup(htmlElement: HTMLElement) {
        super.setup(htmlElement);
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
        return calcOffsetFromDom(this.getId());
    }
}