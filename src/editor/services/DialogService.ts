import { AbstractSettings } from "../views/canvas/settings/AbstractSettings";
import { ServiceLocator } from "./ServiceLocator";
import { UpdateTask } from "./UpdateServices";
import { AnimationSettings } from "../views/canvas/settings/AnimationSettings";
import { Registry } from "../Registry";

export class DialogService {
    serviceName = 'dialog-service';
    activeDialog: AbstractSettings<any> = null;

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    getDialogs() : AbstractSettings<any>[] {
        return [
            this.registry.services.settings.getSettingsByName(AnimationSettings.settingsName)
        ];
    }

    openDialog(dialogType: string) {
        this.activeDialog = this.getDialogByName(dialogType);
        this.loadDialog();
        this.registry.services.update.runImmediately(UpdateTask.All);
    }

    close(): boolean {
        let ret = false;
        if (this.activeDialog) {
            ret = true;
        }
        this.saveDialog();
        this.activeDialog = null;
        this.registry.services.update.runImmediately(UpdateTask.All);
        return ret;
    }

    getDialogByName<T extends AbstractSettings<any>>(dialogType: string): T {
        return <T> this.getDialogs().find(dialog => dialog.getName() === dialogType);
    }

    isActiveDialog(dialogType: string): boolean {
        return this.activeDialog && this.activeDialog.getName() === dialogType;
    }

    isOpen(): boolean {
        return !!this.activeDialog;
    }

    private loadDialog() {
        switch(this.activeDialog.getName()) {
            case AnimationSettings.settingsName:
                (<AnimationSettings> this.activeDialog).load();
        }
    }

    private saveDialog() {
        switch(this.activeDialog.getName()) {
            case AnimationSettings.settingsName:
                (<AnimationSettings> this.activeDialog).save();
        }
    }
}
