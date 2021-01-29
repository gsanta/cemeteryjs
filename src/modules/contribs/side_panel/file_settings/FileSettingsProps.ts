import { saveAs } from 'file-saver';
import { PropContext, ParamController } from '../../../../core/controller/FormController';

export enum FileSettingsProps {
    Export = 'Export',
    Import = 'Import',
    NewProject = 'NewProject'
}

export class ExportFileController extends ParamController<string> {
    acceptedProps() { return [FileSettingsProps.Export]; }

    click(context: PropContext) {
        const file = context.registry.services.export.export();
        var blob = new Blob([file], { type: "text/plain;charset=utf-8" });
        saveAs(blob, "dynamic.txt");
    }
}

export class ImportFileController extends ParamController<{ data: string }> {
    acceptedProps() { return [FileSettingsProps.Import]; }

    change(val: {data: string}, context: PropContext) {
        context.registry.data.clearData();
        context.registry.services.import.import(val.data);

        context.registry.services.render.reRenderAll();
    }
}

export class NewProjectController extends ParamController {
    acceptedProps() { return [FileSettingsProps.NewProject]; }

    click(context: PropContext) {
        context.registry.data.clearData();
        context.registry.services.history.createSnapshot();
        context.registry.services.render.reRenderAll();
    }
}