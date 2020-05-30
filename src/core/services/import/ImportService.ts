import * as convert from 'xml-js';
import { PluginJson } from '../../../plugins/common/io/AbstractPluginImporter';
import { Registry } from '../../Registry';

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

        g: SectionJson[];
    }
}

export interface SectionJson {
    _attributes: {
        "data-section": string; 
    }

    g: PluginJson[];
}

export class ImportService {
    serviceName = 'import-service';
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    import(file: string): void {
        
        
        const rawJson: RawWorldMapJson = JSON.parse(convert.xml2json(file, {compact: true, spaces: 4}));
        const sectionsJson: SectionJson[] = rawJson.svg.g.length ? rawJson.svg.g : [<any> rawJson.svg.g];

        const pluginSection = this.findSectionById(sectionsJson, 'plugins');
        const pluginsJson: PluginJson[] = pluginSection.g.length ? pluginSection.g : [<any> pluginSection.g];

        pluginsJson.forEach(pluginJson => this.findPluginImporter(pluginJson)?.importer.import(pluginJson));

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

    private findPluginImporter(pluginJson: PluginJson) {
        return this.registry.services.plugin.plugins.find(plugin => plugin.getId() === pluginJson._attributes['data-plugin-id']);
    }

    private findSectionById(sectionsJson: SectionJson[], id: string) {
        return sectionsJson.find(json => json._attributes['data-section'] === id);
    }
}