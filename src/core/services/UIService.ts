import { UI_Layout } from "../gui_builder/UI_Element";

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


export class UIService {
    private regionMap: Map<UI_Region, UI_Layout[]> = new Map();

    constructor() {
        UI_Region.all().forEach(region => {
            this.regionMap.set(region, []);
        });
    }

    addUI(region: UI_Region, layout: UI_Layout) {
        this.regionMap.get(region).push(layout);
    }

    getUI(region: UI_Region) {
        return this.regionMap.get(region);
    }
}