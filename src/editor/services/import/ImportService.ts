import * as convert from 'xml-js';
import { IConceptImporter } from './IConceptImporter';
import { CanvasView } from '../../views/canvas/CanvasView';
import { Point } from '../../../misc/geometry/shapes/Point';
import { Stores } from '../../stores/Stores';
import { MeshConceptImporter } from './MeshConceptImporter';
import { PathConceptImporter } from './PathConceptImporter';
import { Camera } from '../../views/canvas/models/Camera';
import { ServiceLocator } from '../ServiceLocator';
import { CanvasItemType } from '../../views/canvas/models/CanvasItem';

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
            "data-zoom": string;
            "data-viewbox": string;
        };

        g: ExportGroupJson[];
    }
}

export interface ExportGroupJson {
    _attributes: {
        "data-export-group": string;
    }

    g: (ConceptGroupJson | ViewGroupJson)[];
}

export interface ConceptGroupJson {
    _attributes: {
        "data-concept-type": string
    }
}

export interface ViewGroupJson {
    _attributes: {
        "data-view-type": string;
    }
}

export class ImportService {
    serviceName = 'import-service';
    private viewImporters: IConceptImporter[];
    private getStores: () => Stores;
    private getServices: () => ServiceLocator;

    constructor(getServices: () => ServiceLocator, getStores: () => Stores) {
        this.getServices = getServices;
        this.getStores = getStores;
        this.viewImporters = [
            new MeshConceptImporter(rect => this.getStores().canvasStore.addConcept(rect)),
            new PathConceptImporter(path => this.getStores().canvasStore.addConcept(path))
        ]
    }

    import(file: string): void {
        const rawJson: RawWorldMapJson = JSON.parse(convert.xml2json(file, {compact: true, spaces: 4}));
        const viewGroups = <ViewGroupJson[]> (rawJson.svg.g[0].g as any)?.length ? rawJson.svg.g[0].g : [rawJson.svg.g[0].g];

        let conceptGroups: ConceptGroupJson[] = [];
        if (rawJson.svg.g[1] && rawJson.svg.g[1].g) {
            conceptGroups = <ConceptGroupJson[]> ((rawJson.svg.g[1].g as any)?.length ? rawJson.svg.g[1].g : [rawJson.svg.g[1].g]);
        }

        viewGroups.forEach(group => {
            const viewType = <CanvasItemType> group._attributes["data-view-type"];
            if (this.getStores().viewStore.getViewById(viewType)) {
                this.getStores().viewStore.getViewById(viewType).importer.import(group);
            }
        });

        conceptGroups
        .forEach(group => {
            const conceptType = <CanvasItemType> group._attributes["data-concept-type"];
            this.findViewImporter(conceptType).import(group)
        });

        this.getStores().canvasStore.getMeshConcepts().filter(item => item.modelPath).forEach(item => this.getServices().meshDimensionService().setDimensions(item));
    }

    private findViewImporter(viewType: CanvasItemType): IConceptImporter {
        return this.viewImporters.find(view => view.type === viewType);
    }
}