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

    import(file: string): void {
        // try {
            const json = JSON.parse(file);
            const entries = Array.from(this.moduleImporters.entries());
            for (let i = 0; i < entries.length; i++) {
                const [name, importer] = entries[i];
                importer.import(json.modules[name]);
            }
        // } catch (e) {
        //     console.error(e);
        // }

        this.registry.services.render.reRenderAll();
    }
}