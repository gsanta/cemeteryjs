import { Registry } from '../Registry';
import { UI_Container } from '../ui_components/elements/UI_Container';
import { AbstractPluginImporter } from '../services/import/AbstractPluginImporter';
import { IDataExporter } from '../services/export/IDataExporter';
import { FormController, ParamControllers } from './controller/FormController';
import { ToolController } from './controller/ToolController';
import { IRenderer } from './IRenderer';

export enum UI_Region {
    Sidepanel = 'Sidepanel',
    Dialog = 'Dialog',
    Canvas1 = 'Canvas1',
    Canvas2 = 'Canvas2'
}

export namespace UI_Region {
    let regions: UI_Region[];

    export function all() {
        if (regions) { return regions; }

        regions = [];
        for (let item in UI_Region) {
            if (isNaN(Number(item))) {
                regions.push(item as UI_Region);
            }
        }

        return regions;
    }

    export function isSinglePluginRegion(region: UI_Region) {
        switch(region) {
            case UI_Region.Canvas1:
            case UI_Region.Canvas2:
            case UI_Region.Dialog:
                return true;
            default:
                return false;
        }
    }
}

export class UI_Panel {
    id: string;
    displayName: string;
    region: UI_Region;
    isGlobalPanel = true;

    htmlElement: HTMLElement;

    importer: AbstractPluginImporter;
    exporter: IDataExporter;

    renderer: IRenderer;
    controller: ParamControllers;
    data: Map<string, any> = new Map();

    private onMountedFunc: () => void;
    private onUnmountedFunc: () => void;

    getFormController(controllerId: string): FormController { return undefined; }

    protected registry: Registry;

    constructor(registry: Registry, region: UI_Region, id: string, displayName: string) {
        this.registry = registry;
        this.region = region;
        this.id = id;
        this.displayName = displayName;
    }

    activated() {}
    mounted(htmlElement: HTMLElement) {
        this.htmlElement = htmlElement;
        this.onMountedFunc && this.onMountedFunc();
    }

    unmounted() {
        this.onUnmountedFunc && this.onUnmountedFunc();
    }

    onMounted(onMountedFunc: () => void) {
        this.onMountedFunc = onMountedFunc;
    }

    onUnmounted(onUnmountedFunc: () => void) {
        this.onUnmounted = onUnmountedFunc;
    }

    // TODO should be temporary, port it to PointerService somehow
    over() {

    }
}