import { saveAs } from 'file-saver';
import { AbstractController } from '../../../core/plugins/controllers/AbstractController';
import { UI_Plugin } from '../../../core/plugins/UI_Plugin';
import { Registry } from '../../../core/Registry';


export enum FileSettingsProps {
    Export = 'Export',
    Import = 'Import',
    NewProject = 'NewProject'
}

export const FileSettingsControllerId = 'file-settings-controller';
export class FileSettingsController extends AbstractController<FileSettingsProps> {
    id = FileSettingsControllerId;

    constructor(plugin: UI_Plugin, registry: Registry) {
        super(plugin, registry);

        this.createPropHandler(FileSettingsProps.Export)
            .onClick(() => {
                const file = this.registry.services.export.export();
                var blob = new Blob([file], { type: "text/plain;charset=utf-8" });
                saveAs(blob, "dynamic.txt");
            });

        this.createPropHandler<{data: string}>(FileSettingsProps.Import)
            .onChange((val) => {
                this.registry.stores.stores.forEach(store => store.clear());
                this.registry.services.import.import(val.data);
    
                this.registry.services.render.reRenderAll();
            });

        this.createPropHandler(FileSettingsProps.NewProject)
            .onClick(() => {
                this.registry.stores.stores.forEach(store => store.clear());
                this.registry.services.history.createSnapshot();
                this.registry.services.render.reRenderAll();
            });
    }
}