import * as convert from 'xml-js';
import { IViewImporter } from './IViewImporter';
import { MeshViewImporter } from '../../../plugins/scene_editor/io/import/MeshViewImporter';
import { ModelViewImporter } from '../../../plugins/scene_editor/io/import/ModelViewImporter';
import { Registry } from '../../Registry';
import { PathViewImporter } from '../../../plugins/scene_editor/io/import/PathViewImporter';
import { ConceptType } from '../../models/views/View';
import { PluginJson } from '../../../plugins/common/io/AbstractPluginImporter';

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

        g: PluginJson[];
    }
}

export class ImportService {
    serviceName = 'import-service';
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    import(file: string): void {
        
        
        const rawJson: RawWorldMapJson = JSON.parse(convert.xml2json(file, {compact: true, spaces: 4}));
        const pluginJsons = <PluginJson[]> (rawJson.svg.g[0].g as any)?.length ? rawJson.svg.g[0].g : [rawJson.svg.g[0].g];

        pluginJsons.forEach(pluginJson => this.findPluginImporter(pluginJson).importer?.import(pluginJson));

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
}