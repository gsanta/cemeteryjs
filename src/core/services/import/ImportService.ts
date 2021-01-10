import { Registry } from '../../Registry';
import { AppJson } from '../export/ExportService';

export class ImportService {
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    async import(file: string): Promise<void> {
        try {
            const json = <AppJson> JSON.parse(file);

            this.importObjs(json);
            this.importViews(json);

        } catch (e) {
            console.error(e);
        }

        this.registry.services.render.reRenderAll();
    }

    private importObjs(json: AppJson) {
        this.registry.stores.assetStore.importFrom(json);
        this.registry.stores.objStore.importFrom(json);
    }

    private importViews(json: AppJson) {
        this.registry.data.view.node.importFrom(json);
        this.registry.data.view.scene.importFrom(json);
    }
}