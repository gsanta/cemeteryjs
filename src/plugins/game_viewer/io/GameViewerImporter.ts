import { MeshView } from '../../../core/models/views/MeshView';
import { PathView } from '../../../core/models/views/PathView';
import { ConceptType } from "../../../core/models/views/View";
import { AbstractPluginImporter } from "../../common/io/AbstractPluginImporter";
import { MeshLoaderService } from '../../../core/services/MeshLoaderService';

export class GameViewerImporter extends AbstractPluginImporter {
    import(): void {
        this.registry.stores.gameStore.clear();
        const meshLoaderService = this.plugin.pluginServices.byName<MeshLoaderService>(MeshLoaderService.serviceName);
        meshLoaderService.clear();

        this.registry.stores.canvasStore.getAllConcepts().forEach(view => {
            if (view.type === ConceptType.MeshConcept || view.type === ConceptType.PathConcept) {
                this.registry.stores.gameStore.add(view as MeshView | PathView);
            }
        });

        meshLoaderService.loadAll(this.registry.stores.gameStore.getMeshObjects())
            .then(() => {
                this.registry.stores.gameStore.getMeshObjects().forEach(meshObject => this.registry.stores.meshStore.createInstance(meshObject.model));
            });
    }
}