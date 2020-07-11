import { AbstractController } from '../scene_editor/settings/AbstractController';
import { Registry } from '../../core/Registry';
import { saveAs } from 'file-saver';
import { RenderTask } from '../../core/services/RenderServices';
import { ToolType } from '../common/tools/Tool';
import { DeleteTool } from '../common/tools/DeleteTool';


export enum FileSettingsProps {
    Export = 'Export',
    Import = 'Import',
    NewProject = 'NewProject'
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

        this.addPropHandlers(
            FileSettingsProps.Import,
            {
                onChange: (val) => {
                    this.registry.stores.canvasStore.clear();
                    this.registry.stores.selectionStore.clear();
                    this.registry.services.import.import(val.data);

                    this.registry.services.render.runImmediately(RenderTask.RenderFull);
                }    
            }
        );

        this.addPropHandlers(
            FileSettingsProps.NewProject,
            {
                onClick: () => {
                    this.registry.plugins.sceneEditor.tools.byType<DeleteTool>(ToolType.Delete).eraseAll();
                }    
            }
        );
    }
}