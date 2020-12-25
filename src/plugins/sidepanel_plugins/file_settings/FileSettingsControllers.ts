import { saveAs } from 'file-saver';
import { ParamControllers, PropController } from '../../../core/plugin/controller/FormController';
import { Registry } from '../../../core/Registry';

export class FileSettingsControllers extends ParamControllers {
    constructor(registry: Registry) {
        super();

        this.export = new ExportFileController(registry);
        this.import = new ImportFileController(registry);
        this.newProject = new NewProjectController(registry);
    }

    export: ExportFileController;
    import: ImportFileController;
    newProject: NewProjectController;
}

export class ExportFileController extends PropController<string> {
    click() {
        const file = this.registry.services.export.export();
        var blob = new Blob([file], { type: "text/plain;charset=utf-8" });
        saveAs(blob, "dynamic.txt");
    }
}

export class ImportFileController extends PropController {
    change(val: {data: string}) {
        this.registry.data.clearData();
        this.registry.services.import.import(val.data);

        this.registry.services.render.reRenderAll();
    }
}

export class NewProjectController extends PropController {
    click() {
        this.registry.data.clearData();
        this.registry.services.history.createSnapshot();
        this.registry.services.render.reRenderAll();
    }
}