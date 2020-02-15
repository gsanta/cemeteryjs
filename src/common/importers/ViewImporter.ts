import { ICanvasImporter } from '../../editor/controllers/windows/ICanvasImporter';
import * as convert from 'xml-js';
import { ViewType } from '../views/View';
import { IViewImporter } from '../../editor/controllers/windows/canvas/tools/IToolImporter';

export interface WgDefinition {
    _attributes: WgDefinitionAttributes;
}

export interface WgDefinitionAttributes {
    color: string;
    "roles": string;
    "materials": string;
    model: string;
    scale: string;
    "translate-y": string;
    "type-name": string;
}

export interface RawWorldMapJson {
    svg: {
        metadata: {
            "wg-type": WgDefinition[]
        };

        _attributes: {
            "data-wg-width": string;
            "data-wg-height": string;
            "data-wg-pixel-size": string;
            "data-wg-scale-x": string;
            "data-wg-scale-y": string;
        };

        g: ViewGroupJson[];
    }
}

export interface ViewGroupJson<T = any> {
    _attributes: {
        "data-view-type": string
    }
}

export class ViewImporter implements ICanvasImporter {
    private viewImporters: IViewImporter[];

    constructor(viewImporters: IViewImporter[]) {
        this.viewImporters = viewImporters;
    }

    import(file: string): void {
        const rawJson: RawWorldMapJson = JSON.parse(convert.xml2json(file, {compact: true, spaces: 4}));
        const toolGroups = rawJson.svg.g ? rawJson.svg.g.length ? rawJson.svg.g : [rawJson.svg.g] : [];

        toolGroups.forEach(toolGroup => {
            const viewType: ViewType = <ViewType> toolGroup._attributes["data-view-type"];
            this.findViewImporter(viewType).import(toolGroup)

        });
    }

    private findViewImporter(viewType: ViewType): IViewImporter {
        return this.viewImporters.find(view => view.type === viewType);
    }
}