import { saveAs } from 'file-saver';
import { PropContext, PropController } from '../../../core/plugin/controller/FormController';

export enum FileSettingsProps {
    Export = 'Export',
    Import = 'Import',
    NewProject = 'NewProject'
}

export class ExportFileController extends PropController<string> {
    
    constructor() {
        super(FileSettingsProps.Export);
    }

    click(context: PropContext) {
        const file = context.registry.services.export.export();
        var blob = new Blob([file], { type: "text/plain;charset=utf-8" });
        saveAs(blob, "dynamic.txt");
    }
}

export class ImportFileController extends PropController<{ data: string }> {
    
    constructor() {
        super(FileSettingsProps.Import);
    }

    change(val: {data: string}, context: PropContext) {
        context.registry.stores.clear();
        context.registry.services.import.import(val.data);

        context.registry.services.render.reRenderAll();
    }
}

export class NewProjectController extends PropController {
    
    constructor() {
        super(FileSettingsProps.NewProject);
    }

    click(context: PropContext) {
        context.registry.stores.clear();
        context.registry.services.history.createSnapshot();
        context.registry.services.render.reRenderAll();
    }
}