import { UI_Layout } from './gui_builder/UI_Element';
import { AbstractSettings } from '../plugins/scene_editor/settings/AbstractSettings';
import { IControlledObject } from './IControlledObject';
import { Registry } from './Registry';

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
}

export abstract class UI_Plugin implements IControlledObject {
    objectCapabilities = [];
    id: string;
    region: UI_Region;
    abstract render(): UI_Layout;

    controller: AbstractSettings;
    protected registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;

        this.registry.services.plugin.register_ui_plugin(this);
    }
}