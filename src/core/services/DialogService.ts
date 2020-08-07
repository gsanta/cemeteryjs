import { Registry } from "../Registry";
import { RenderTask } from "./RenderServices";
import { AbstractSettings } from "../../plugins/scene_editor/settings/AbstractSettings";

export class DialogService {
    serviceName = 'dialog-service';
    dialogs: AbstractSettings[] = [];

    dialogController: AbstractSettings;

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    openDialog(dialogController: AbstractSettings) {
        this.dialogController = dialogController;
        this.registry.services.render.reRenderAll;
    }

    close(): boolean {
        let ret = false;
        if (this.dialogController) { ret = true; }

        this.dialogController = null;
        this.registry.services.render.reRenderAll;
        return ret;
    }

    isOpen(): boolean {
        return !!this.dialogController;
    }
}
