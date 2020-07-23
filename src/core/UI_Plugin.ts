import { IControlledObject } from './IControlledObject';
import { Registry } from './Registry';
import { AbstractController } from '../plugins/scene_editor/settings/AbstractController';
import { UI_AccordionTab } from './gui_builder/elements/UI_Accordion';
import { UI_Container } from './gui_builder/elements/UI_Container';
import { UI_Layout } from './gui_builder/elements/UI_Layout';

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

    render(): UI_Container {
        if (this.region === UI_Region.SidepanelWidget) {
            const accordionTab = new UI_AccordionTab(this.controller, this.region);
            accordionTab.title = this.displayName;
            this.renderInto(accordionTab);
            return accordionTab;
        } else if (this.region === UI_Region.Dialog) {
            const layout = new UI_Layout(this.controller, this.region);

            this.renderInto(layout);
            return layout;
        } else if (this.region === UI_Region.Canvas1) {
            const layout = new UI_Layout(this.controller, this.region);

            this.renderInto(layout);
            return layout;
        }
    }

    protected abstract renderInto(layout: UI_Layout): void;

    controller: AbstractController;
    protected registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }
}