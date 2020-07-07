import { UI_Layout } from './gui_builder/UI_Element';
import { AbstractSettings } from '../plugins/scene_editor/settings/AbstractSettings';

export enum UI_Region {
    Sidepanel = 'SidePanel',
    Dialog = 'Dialog',
    MainPrimary = 'MainPrimary',
    MainSecondary = 'MainSecondary'
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
    }
}

export abstract class UI_Plugin {
    id: string;
    region: UI_Region;
    abstract render(): UI_Layout;

    controller: AbstractSettings;

    constructor(controller: AbstractSettings) {
        this.controller = controller;
    }
}