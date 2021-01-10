import { Registry } from '../../Registry';
import { AbstractModuleImporter } from './AbstractModuleImporter';

export class ImportService {
    private registry: Registry;
    private moduleImporters: Map<string, AbstractModuleImporter> = new Map();

    constructor(registry: Registry) {
        this.registry = registry;
    }

    registerImporter(moduleName: string, importer: AbstractModuleImporter) {
        this.moduleImporters.set(moduleName, importer);
    }

    unRegisterImporter(moduleName: string) {
        this.moduleImporters.delete(moduleName);
    }

    async import(file: string): Promise<void> {
        try {
            
            const json = JSON.parse(file);
            Array.from(this.moduleImporters.entries()).forEach(([name, importer]) => importer.import(json.modules[name]));

        } catch (e) {
            console.error(e);
        }

        this.registry.services.render.reRenderAll();
    }
}