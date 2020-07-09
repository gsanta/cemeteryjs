import { AbstractPlugin, calcOffsetFromDom } from '../../core/AbstractPlugin';
import { Point } from '../../core/geometry/shapes/Point';
import { Registry } from '../../core/Registry';
import { EngineService } from '../../core/services/EngineService';
import { MeshLoaderService } from '../../core/services/MeshLoaderService';
import { ICamera } from '../common/camera/ICamera';
import { PluginServices } from '../common/PluginServices';
import { PluginSettings } from '../common/PluginSettings';
import { toolFactory } from '../common/toolbar/toolFactory';
import { Tool, ToolType } from '../common/tools/Tool';
import { Tools } from '../Tools';
import { AssetLoaderDialogController } from './controllers/AssetLoaderDialogController';
import { AssetLoaderSidepanelController } from './controllers/AssetLoaderSidepanelController';
import { UI_Region } from '../../core/UI_Plugin';
(<any> window).earcut = require('earcut');

export function getCanvasElement(viewId: string): HTMLCanvasElement {
    if (typeof document !== 'undefined') {
        const canvas: HTMLCanvasElement = document.querySelector(`#${viewId} canvas`);
        return canvas;
    }
}

export const AssetLoaderPluginId = 'asset-loader-plugin';

export class AssetLoaderPlugin extends AbstractPlugin {
    id = AssetLoaderPluginId;
    region = UI_Region.Dialog;

    constructor(registry: Registry) {
        super(registry);

        const tools = [ToolType.Camera].map(toolType => toolFactory(toolType, this, registry));
        this.tools = new Tools(tools);

        this.selectedTool = this.tools.byType(ToolType.Camera);

        this.pluginServices = new PluginServices(
            [
                new EngineService(this, this.registry),
                new MeshLoaderService(this, this.registry)
            ]
        );

        this.pluginSettings = new PluginSettings(
            [
                new AssetLoaderDialogController(this, this.registry),
                new AssetLoaderSidepanelController(this, this.registry)
            ]
        );

        this.pluginSettings.dialogController = this.pluginSettings.byName<AssetLoaderDialogController>(AssetLoaderDialogController.settingsName);
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

    getSelectedTool(): Tool {
        return this.selectedTool;
    } 

    getOffset() {
        if (this.htmlElement) {
            return calcOffsetFromDom(this.htmlElement);
        }

        return new Point(0, 0);
    }
}