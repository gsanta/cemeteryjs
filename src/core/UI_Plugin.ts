import { IControlledObject } from './IControlledObject';
import { Registry } from './Registry';
import { AbstractController } from '../plugins/scene_editor/settings/AbstractController';
import { UI_Accordion } from './gui_builder/elements/surfaces/UI_Accordion';
import { UI_Container } from './gui_builder/elements/UI_Container';
import { UI_Layout } from './gui_builder/elements/UI_Layout';
import { Tool } from '../plugins/common/tools/Tool';

export enum UI_Region {
    SidepanelWidget = 'SidepanelWidget',
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

    protected controllers: Map<string, AbstractController> = new Map();
    protected tools: Map<string, Tool> = new Map();

    protected abstract renderInto(layout: UI_Container): void;

    protected registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    render(): UI_Container {
        if (this.region === UI_Region.SidepanelWidget) {
            const layout = new UI_Layout(this, this.region);
            const accordion = layout.accordion(null);
            accordion.title = this.displayName;
            this.renderInto(accordion);
            return layout;
        } else if (this.region === UI_Region.Dialog) {
            const layout = new UI_Layout(this, this.region);

            this.renderInto(layout);
            return layout;
        } else if (this.region === UI_Region.Canvas1) {
            const layout = new UI_Layout(this, this.region);

            this.renderInto(layout);
            return layout;
        }
    }

    getControllerById(id: string) {
        return this.controllers.get(id);
    }

    getToolById(id: string) {
        return this.tools.get(id);
    }

    // TODO should be temporary, port it to PointerService somehow
    over() {

    }
}