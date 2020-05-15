import * as convert from 'xml-js';
import { AnimationConceptImporter } from '../../../core/services/import/AnimationConceptImporter';
import { IConceptImporter } from '../../../core/services/import/IConceptImporter';
import { MeshConceptImporter } from './MeshConceptImporter';
import { ModelConceptImporter } from './ModelConceptImporter';
import { Registry } from '../../Registry';
import { PathConceptImporter } from './PathConceptImporter';
import { ConceptType } from '../../models/views/View';

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
            "data-y-pos": string;
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
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
        this.conceptImporters = [
            new ModelConceptImporter(registry),
            new MeshConceptImporter(registry),
            new PathConceptImporter(registry),
            new AnimationConceptImporter(registry)
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
            if (this.registry.services.layout.getViewById(viewType)) {
                this.registry.services.layout.getViewById(viewType).importer.import(group);
            }
        });

        conceptGroups
        .forEach(group => {
            const conceptType = <ConceptType> group._attributes["data-concept-type"];
            this.findViewImporter(conceptType).import(group)
        });

        this.registry.stores.canvasStore.getMeshConcepts().filter(item => item.modelId)
            .forEach(item => {
                const modelConcept = this.registry.stores.canvasStore.getModelConceptById(item.modelId);
                this.registry.services.meshLoader.getDimensions(modelConcept, item.id)
                    .then(dim => {
                        item.dimensions.setWidth(dim.x);
                        item.dimensions.setHeight(dim.y);
                    });

                this.registry.services.meshLoader.getAnimations(modelConcept, item.id)
                    .then(animations => {
                        item.animations = animations;
                    })
            });
        this.registry.services.game.importAllConcepts();
    }

    private findViewImporter(conceptType: ConceptType): IConceptImporter {
        return this.conceptImporters.find(conceptImporter => conceptImporter.type === conceptType);
    }
}