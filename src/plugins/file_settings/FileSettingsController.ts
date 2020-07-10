import { AbstractController } from '../scene_editor/settings/AbstractController';
import { Registry } from '../../core/Registry';
import { saveAs } from 'file-saver';


export enum FileSettingsProps {
    Export = 'Export',
}

export class FileSettingsController extends AbstractController<FileSettingsProps> {


    constructor(registry: Registry) {
        super(registry);

        this.addPropHandlers(
            FileSettingsProps.Export,
            {
                onClick: () => {
                    const file = this.registry.services.export.export();
                    var blob = new Blob([file], { type: "text/plain;charset=utf-8" });
                    saveAs(blob, "dynamic.txt");
                }    
            }
        );
    }
}