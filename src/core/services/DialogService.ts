import { Registry } from "../Registry";
import { AnimationSettings } from "../../plugins/scene_editor/settings/AnimationSettings";
import { UpdateTask } from "./UpdateServices";
import { ActionEditorSettings } from '../../plugins/action_editor/settings/ActionEditorSettings';
import { ListActionsSettings } from '../../plugins/scene_editor/settings/ListActionsSettings';

export class DialogService {
    serviceName = 'dialog-service';
    dialogs: string[] = [
        AnimationSettings.settingsName,
        ActionEditorSettings.settingsName,
        ListActionsSettings.settingsName
    ];
    activeDialog: string;

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    openDialog(dialogType: string) {
        this.activeDialog = dialogType;
        this.registry.services.update.runImmediately(UpdateTask.All);
    }

    close(): boolean {
        let ret = false;
        if (this.activeDialog) { ret = true; }

        this.activeDialog = null;
        this.registry.services.update.runImmediately(UpdateTask.All);
        return ret;
    }

    getDialogByName(dialogName: string): string {
        return this.dialogs.find(dialog => dialog === dialogName);
    }

    isActiveDialog(dialogType: string): boolean {
        return this.activeDialog === dialogType;
    }

    isOpen(): boolean {
        return !!this.activeDialog;
    }

    // private loadDialog() {
    //     switch(this.activeDialog.getName()) {
    //         case AnimationSettings.settingsName:
    //             (<AnimationSettings> this.activeDialog).load();
    //     }
    // }

    // private saveDialog() {
    //     switch(this.activeDialog.getName()) {
    //         case AnimationSettings.settingsName:
    //             (<AnimationSettings> this.activeDialog).save();
    //     }
    // }
}
