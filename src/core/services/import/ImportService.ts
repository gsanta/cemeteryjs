import { Registry } from '../../Registry';

export class ImportService {
    private registry: Registry;
    // private moduleImporters: Map<string, AbstractModuleImporter> = new Map();

    constructor(registry: Registry) {
        this.registry = registry;
    }

    // registerImporter(moduleName: string, importer: AbstractModuleImporter) {
    //     this.moduleImporters.set(moduleName, importer);
    // }

    // unRegisterImporter(moduleName: string) {
    //     this.moduleImporters.delete(moduleName);
    // }

    import(file: string): void {
        
        const json = JSON.parse(file);
        
        const canvases = this.registry.services.module.ui.getAllCanvases();

        canvases
            .filter(canvas => canvas.importer)
            .forEach(canvas => canvas.importer.import(json.modules[canvas.id]));

        this.registry.services.render.reRenderAll();
    }
}