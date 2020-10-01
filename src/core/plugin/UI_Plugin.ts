import { IControlledObject } from '../IControlledObject';
import { Registry } from '../Registry';
import { FormController } from './controller/FormController';
import { UI_Container } from '../ui_components/elements/UI_Container';
import { AbstractPluginImporter } from '../services/import/AbstractPluginImporter';
import { UI_Factory } from '../ui_components/UI_Factory';
import { IDataExporter } from '../services/export/IDataExporter';

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

export abstract class UI_Plugin implements IControlledObject {
    objectCapabilities = [];
    id: string;
    displayName: string;
    region: UI_Region;

    importer: AbstractPluginImporter;
    exporter: IDataExporter;

    protected controllers: Map<string, FormController> = new Map();

    protected abstract renderInto(layout: UI_Container): void;

    protected registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    render(): UI_Container {
        if (this.region === UI_Region.Sidepanel) {
            const layout = UI_Factory.layout(this);
            const accordion = layout.accordion(null);
            accordion.title = this.displayName;
            this.renderInto(accordion);
            return layout;
        } else if (this.region === UI_Region.Dialog) {
            const dialog = UI_Factory.dialog(this, {});
            dialog.title = this.displayName;
            this.renderInto(dialog);
            return dialog;

        } else {
            const layout = UI_Factory.layout(this);


            this.renderInto(layout);
            return layout;
        }
    }

    getControllerById(id: string) {
        return this.controllers.get(id);
    }

    activated() {}
    mounted(htmlElement: HTMLElement) {}
    unmounted() {}

    // TODO should be temporary, port it to PointerService somehow
    over() {

    }
}