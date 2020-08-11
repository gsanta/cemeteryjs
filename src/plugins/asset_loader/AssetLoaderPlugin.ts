import { AbstractCanvasPlugin, calcOffsetFromDom } from '../../core/plugins/AbstractCanvasPlugin';
import { Point } from '../../utils/geometry/shapes/Point';
import { Registry } from '../../core/Registry';
import { EngineService } from '../../core/services/EngineService';
import { MeshLoaderService } from '../../core/services/MeshLoaderService';
import { UI_Region } from '../../core/plugins/UI_Plugin';
import { ICamera } from '../common/camera/ICamera';
import { PluginServices } from '../common/PluginServices';
import { PluginSettings } from '../common/PluginSettings';
import { toolFactory } from '../common/toolbar/toolFactory';
import { ToolType } from '../../core/plugins/tools/Tool';
import { AssetLoaderDialogController } from './controllers/AssetLoaderDialogController';
import { AssetLoaderSidepanelController } from './controllers/AssetLoaderSidepanelController';
(<any> window).earcut = require('earcut');

export function getCanvasElement(viewId: string): HTMLCanvasElement {
    if (typeof document !== 'undefined') {
        const canvas: HTMLCanvasElement = document.querySelector(`#${viewId} canvas`);
        return canvas;
    }
}

export const AssetLoaderPluginId = 'asset-loader-plugin';

export class AssetLoaderPlugin extends AbstractCanvasPlugin {
    id = AssetLoaderPluginId;
    region = UI_Region.Dialog;

    constructor(registry: Registry) {
        super(registry);


        [ToolType.Camera].map(toolType => {
            this.toolHandler.registerTool(toolFactory(toolType, this, registry));
        });

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

    mounted(htmlElement: HTMLElement) {
        super.mounted(htmlElement);
    }

    getOffset() {
        if (this.htmlElement) {
            return calcOffsetFromDom(this.htmlElement);
        }

        return new Point(0, 0);
    }

    renderInto() {

    }
}