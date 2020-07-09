import { UI_Layout } from './gui_builder/UI_Element';
import { AbstractSettings } from '../plugins/scene_editor/settings/AbstractSettings';
import { IControlledObject } from './IControlledObject';
import { Registry } from './Registry';
import { AbstractController } from '../plugins/scene_editor/settings/AbstractController';

export enum UI_Region {
    SidepanelWidget = 'SidePanelWidget',
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
    region: UI_Region;
    abstract render(): UI_Layout;

    controller: AbstractController;
    protected registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }
}