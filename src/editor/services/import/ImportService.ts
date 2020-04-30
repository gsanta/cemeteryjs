import * as convert from 'xml-js';
import { Stores } from '../../stores/Stores';
import { ServiceLocator } from '../ServiceLocator';
import { IConceptImporter } from './IConceptImporter';
import { MeshConceptImporter } from './MeshConceptImporter';
import { PathConceptImporter } from './PathConceptImporter';
import { ConceptType } from '../../views/canvas/models/concepts/Concept';
import { AnimationConceptImporter } from './AnimationConceptImporter';
import { ModelConceptImporter } from './ModelConceptImporter';

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
    private conceptImporters: IConceptImporter[];
    private getStores: () => Stores;
    private getServices: () => ServiceLocator;

    constructor(getServices: () => ServiceLocator, getStores: () => Stores) {
        this.getServices = getServices;
        this.getStores = getStores;
        this.conceptImporters = [
            new ModelConceptImporter(getStores),
            new MeshConceptImporter(getStores),
            new PathConceptImporter(getStores),
            new AnimationConceptImporter(getStores)
        ];
    }

    import(file: string): void {
        const rawJson: RawWorldMapJson = JSON.parse(convert.xml2json(file, {compact: true, spaces: 4}));
        const viewGroups = <ViewGroupJson[]> (rawJson.svg.g[0].g as any)?.length ? rawJson.svg.g[0].g : [rawJson.svg.g[0].g];

        let conceptGroups: ConceptGroupJson[] = [];
        if (rawJson.svg.g[1] && rawJson.svg.g[1].g) {
            conceptGroups = <ConceptGroupJson[]> ((rawJson.svg.g[1].g as any)?.length ? rawJson.svg.g[1].g : [rawJson.svg.g[1].g]);
        }

        viewGroups.forEach(group => {
            const viewType = <ConceptType> group._attributes["data-view-type"];
            if (this.getStores().viewStore.getViewById(viewType)) {
                this.getStores().viewStore.getViewById(viewType).importer.import(group);
            }
        });

        conceptGroups
        .forEach(group => {
            const conceptType = <ConceptType> group._attributes["data-concept-type"];
            this.findViewImporter(conceptType).import(group)
        });

        this.getStores().canvasStore.getMeshConcepts().filter(item => item.modelId)
            .forEach(item => {
                const modelConcept = this.getStores().canvasStore.getModelConceptById(item.modelId);
                this.getServices().meshLoader.getDimensions(modelConcept.modelPath, item.id)
                    .then(dim => {
                        item.dimensions.setWidth(dim.x);
                        item.dimensions.setHeight(dim.y);
                    });

                this.getServices().meshLoader.getAnimations(modelConcept.modelPath, item.id)
                    .then(animations => {
                        item.animations = animations;
                    })
            });
        this.getServices().game.importAllConcepts();
    }

    private findViewImporter(conceptType: ConceptType): IConceptImporter {
        return this.conceptImporters.find(conceptImporter => conceptImporter.type === conceptType);
    }
}