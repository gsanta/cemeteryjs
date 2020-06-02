import { Registry } from '../../Registry';
import { View } from '../../models/views/View';
import { AppJson } from '../export/ExportService';
import { IPluginJson } from '../../../plugins/common/io/IPluginExporter';

export class ImportService {
    serviceName = 'import-service';
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    import(file: string): void {
        const json = <AppJson> JSON.parse(file);

        const viewMap: Map<string, View> = new Map();
        json.plugins.forEach(pluginJson => this.findPluginImporter(pluginJson)?.importer.import(pluginJson, viewMap));

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

    private findPluginImporter(pluginJson: IPluginJson) {
        return this.registry.services.plugin.plugins.find(plugin => plugin.getId() === pluginJson.pluginId);
    }
}